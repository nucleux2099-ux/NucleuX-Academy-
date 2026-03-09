/**
 * NucleuX Academy - ATOM v2: Memorist Agent
 * 
 * Manages persistent user knowledge state. 
 * - Pre-Read: Injects relevant past memories and weaknesses into the active context.
 * - Post-Write: Asynchronously analyzes completed sessions to extract new insights.
 */

import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AtomMemory {
    id: string;
    memory_type: 'topic_mastery' | 'weak_area' | 'preference' | 'insight' | 'goal' | 'study_pattern' | 'clinical_connection';
    content: string;
    relevance_score: number;
}

/**
 * Validates if the user has a stored profile/ID
 */
function isValidUser(userId?: string): boolean {
    return !!userId && userId !== 'anonymous' && userId.length > 10;
}

/**
 * Pre-Read: Fetches general un-expiring memories (goals/preferences) and semantically matching memories.
 * NOTE: Search requires generating an embedding for the query.
 */
export async function preReadMemories(userId: string, queryText: string): Promise<string> {
    if (!isValidUser(userId)) return '';

    let memoryContext = '';

    try {
        // 1. Fetch high-level non-expiring/global memories (Goals, Preferences)
        const { data: globalMemories } = await supabase
            .from('atom_user_memory')
            .select('memory_type, content')
            .eq('user_id', userId)
            .in('memory_type', ['goal', 'preference'])
            .order('relevance_score', { ascending: false })
            .limit(3);

        if (globalMemories && globalMemories.length > 0) {
            memoryContext += `\n### Student Goals & Preferences\n`;
            globalMemories.forEach(m => {
                memoryContext += `- [${m.memory_type}]: ${m.content}\n`;
            });
        }

        // 2. Fetch specific semantic memories (Weak Areas, Topic Mastery)
        // First, embed the query text
        const embedRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/embed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({ texts: [queryText] })
        });

        if (embedRes.ok) {
            const embedData = await embedRes.json();
            const queryVector = embedData.embeddings[0];

            // Second, call the search RPC
            const { data: semanticMemories } = await supabase.rpc('search_memories', {
                p_user_id: userId,
                p_embedding: queryVector,
                p_limit: 5,
                p_min_score: 0.3
            });

            if (semanticMemories && semanticMemories.length > 0) {
                memoryContext += `\n### Relevant Past Observations\n`;
                semanticMemories.forEach((m: any) => {
                    memoryContext += `- [${m.memory_type}]: ${m.content}\n`;
                });
            }
        }

    } catch (error) {
        console.warn('Memorist: Pre-Read failed. Proceeding without memory injection.', error);
    }

    if (memoryContext) {
        return `\n\n## Memorist Agent Report\n${memoryContext}\nTake these into account when interacting with the student. Do not mention that you are loading memories heavily, just naturally adapt to them.`;
    }

    return '';
}

/**
 * Post-Write: Asynchronously analyzes a completed turn/session and extracts new memories.
 * This should NOT await in the critical path of the API response.
 */
export async function extractAndStoreMemory(
    userId: string,
    messages: any[],
    sessionId: string,
    room: string
): Promise<void> {
    if (!isValidUser(userId) || messages.length < 2) return;

    // We only run deep extraction every few messages or at session end to save tokens,
    // but for structural purposes, we assume this is called when it's appropriate.

    try {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) return;
        const client = new Anthropic({ apiKey });

        // Format the recent transcript
        const recentMessages = messages.slice(-6); // Only look at last 3 turns
        const transcript = recentMessages.map(m => `${m.role.toUpperCase()}: ${typeof m.content === 'string' ? m.content : 'Multi-modal content'}`).join('\n\n');

        const extractionPrompt = `
You are the Memorist agent for a medical tutoring system. 
Analyze the following partial conversation between a medical student and an AI tutor.
Determine if there are any SIGNIFICANT, NEW observations about the student's learning state.

Categories:
1. 'weak_area': Student fundamentally misunderstood a concept multiple times.
2. 'topic_mastery': Student demonstrated strong understanding of a complex topic.
3. 'clinical_connection': Student successfully applied basic science to a clinical scenario.

If you find a profound insight, return a VALID JSON array of objects. 
Otherwise, return an empty array [].
Format: [{ "memory_type": "...", "content": "Concise 1-sentence description." }]

Transcript:
${transcript}
`;

        const response = await client.messages.create({
            model: 'claude-3-5-haiku-20241022', // Use fast/cheap model for background tasks
            max_tokens: 300,
            temperature: 0.1,
            messages: [{ role: 'user', content: extractionPrompt }]
        });

        const firstContent = response.content[0];
        if (firstContent.type !== 'text') return;

        const output = firstContent.text;

        // Attempt to parse JSON from output (Haiku sometimes wraps in markdown)
        const jsonMatch = output.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return;

        const extracted = JSON.parse(jsonMatch[0]) as { memory_type: string, content: string }[];

        if (extracted.length > 0) {
            for (const memory of extracted) {
                // Embed the new memory
                const embedRes = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/embed`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
                    },
                    body: JSON.stringify({ texts: [memory.content] })
                });

                let embedding = null;
                if (embedRes.ok) {
                    const embedData = await embedRes.json();
                    embedding = embedData.embeddings[0];
                }

                // Insert into DB
                await supabase.from('atom_user_memory').insert({
                    user_id: userId,
                    memory_type: memory.memory_type,
                    content: memory.content,
                    embedding: embedding,
                    source_room: room,
                    relevance_score: 1.0,
                    strength: 50
                });
                console.log(`[Memorist] Stored new memory: [${memory.memory_type}] ${memory.content}`);
            }
        }
    } catch (error) {
        console.error('[Memorist] Background extraction failed:', error);
    }
}
