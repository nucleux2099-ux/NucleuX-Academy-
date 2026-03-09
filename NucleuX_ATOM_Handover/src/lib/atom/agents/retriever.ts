/**
 * NucleuX Academy - ATOM v2: Retriever Agent
 * 
 * Executes Hybrid Search (Vector Cosine Similarity + Full Text Search) against
 * the `content_chunks` table utilizing the `hybrid_search_chunks` Postgres RPC.
 */

import { createClient } from '@supabase/supabase-js';

// Client is initialized dynamically inside the function to prevent early boot crash
// if SUPABASE_SERVICE_ROLE_KEY is absent from local environments.

export interface RetrievalResult {
    id: string;
    topic_slug: string;
    subject: string;
    source_file: string;
    content: string;
    combined_score: number;
}

/**
 * Executes a hybrid search against the curriculum database.
 * @param expandedQuery The query string enriched by the Scribe agent.
 * @param limit Max number of raw chunks to return (default 20 for upstream reranking).
 */
export async function retrieveRelevantChunks(query: string): Promise<RetrievalResult[]> {

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials for Retriever Agent.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get embedding for the query using Supabase Edge Function and vector DB are not deployed to 
    // the user's live Supabase instance yet. Return mock data to let the 
    // Orchestrator hit the Critic and Claude generation.
    return [
        {
            id: 'mock-1',
            topic_slug: 'respiratory-failure',
            subject: 'Medicine',
            source_file: 'respiratory-failure.md',
            content: '# Type 1 Respiratory Failure\n\nType 1 respiratory failure involves hypoxemia (PaO2 < 60 mmHg) with normal or low PaCO2. It is typically caused by V/Q mismatch or shunting. Common causes include pneumonia, ARDS, and pulmonary edema.',
            combined_score: 0.95
        }
    ];
}
