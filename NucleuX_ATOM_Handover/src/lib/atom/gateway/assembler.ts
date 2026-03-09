/**
 * NucleuX Academy - ATOM v2: Context Assembler
 * 
 * Bundles retrieved and reranked chunks into the final string
 * to be injected into Claude's context window. Tracks token
 * limits to ensure we don't breach the allocated 50,000 token budget.
 */

import { RetrievalResult } from '../agents/retriever';

// Token Budgets (Approximate, based on Claude 3.5 Sonnet's 200K window)
const TOTAL_BUDGET = 200000;
const BUFFER = 2000; // Room for system prompts
const MAX_RAG_CONTEXT = TOTAL_BUDGET - BUFFER;

export function assembleContext(chunks: RetrievalResult[]): string {
    if (!chunks || chunks.length === 0) {
        return '[No relevant library content found for this query.]';
    }

    let assembledText = '';
    let tokenCount = 0;

    for (const chunk of chunks) {
        // Check if adding this chunk exceeds the budget
        // Estimate tokens (approx 4 chars/token). Or use provided chunk metadata if available.
        const estimatedTokens = Math.ceil(chunk.content.length / 4);

        if (tokenCount + estimatedTokens > MAX_RAG_CONTEXT) {
            console.warn(`Context Assembler reached limit (${tokenCount}/${MAX_RAG_CONTEXT}). Truncating further chunks.`);
            break;
        }

        assembledText += `\n\n--- Source: ${chunk.source_file} (${chunk.topic_slug}) ---\n`;
        assembledText += chunk.content;

        tokenCount += estimatedTokens;
    }

    return assembledText.trim();
}
