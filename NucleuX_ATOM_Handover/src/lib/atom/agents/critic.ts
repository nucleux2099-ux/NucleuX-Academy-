/**
 * NucleuX Academy - ATOM v2: Critic Agent
 * 
 * Integrates Cohere Rerank (Cross-Encoder) to refine the top 20 candidates
 * retrieved by Hybrid Search down to the 5 most pedagogically relevant chunks.
 */

import { RetrievalResult } from './retriever';

export interface CriticResult {
    acceptedChunks: RetrievalResult[];
    rejectedCount: number;
}

/**
 * Re-ranks retrieved chunks using Cohere's dedicated reranking model.
 * Falls back to raw hybrid scores if Cohere fails.
 */
export async function rerankContext(
    originalQuery: string,
    candidates: RetrievalResult[],
    topN: number = 5,
    relevanceThreshold: number = 0.3
): Promise<CriticResult> {
    const cohereApiKey = process.env.COHERE_API_KEY;

    // Fallback: If no API key or barely any candidates, skip reranking.
    // Just sort by 'combined_score' (already done by RPC) and slice.
    if (!cohereApiKey || candidates.length <= topN) {
        return {
            acceptedChunks: candidates.slice(0, Math.max(topN, candidates.length)),
            rejectedCount: Math.max(0, candidates.length - topN)
        };
    }

    const documents = candidates.map(c => c.content);

    try {
        const response = await fetch('https://api.cohere.com/v1/rerank', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cohereApiKey}`
            },
            body: JSON.stringify({
                model: 'rerank-english-v3.0',
                query: originalQuery, // Use original, unexpanded intent for structural relevance
                documents: documents,
                top_n: topN,
                return_documents: false
            })
        });

        if (!response.ok) {
            throw new Error(`Cohere API error: ${response.statusText}`);
        }

        const data = await response.json();

        const acceptedChunks: RetrievalResult[] = [];
        let rejectedCount = 0;

        for (const res of data.results) {
            if (res.relevance_score >= relevanceThreshold) {
                // Map back to our original candidate object
                acceptedChunks.push(candidates[res.index]);
            } else {
                rejectedCount++;
            }
        }

        // Edge case: if threshold is too strict and filters everything, fallback to top 2 raw
        if (acceptedChunks.length === 0 && candidates.length > 0) {
            return {
                acceptedChunks: candidates.slice(0, 2),
                rejectedCount: candidates.length - 2
            };
        }

        return {
            acceptedChunks,
            rejectedCount: rejectedCount + (candidates.length - data.results.length)
        };

    } catch (error) {
        console.warn('Critic Agent Reranking failed. Falling back to raw Hybrid scores.', error);
        return {
            acceptedChunks: candidates.slice(0, topN),
            rejectedCount: candidates.length - topN
        };
    }
}
