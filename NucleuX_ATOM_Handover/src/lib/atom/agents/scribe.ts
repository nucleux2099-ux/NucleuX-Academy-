/**
 * NucleuX Academy - ATOM v2: Scribe Agent
 * 
 * Scribe is the first agent in the Gateway sequence. It analyzes the user's latest query,
 * determines the pedagogical intent, and expands medical terminology for the Retriever agent.
 */

export type UserIntent = 'learn' | 'practice' | 'review' | 'differentiate' | 'explore' | 'chit_chat';

export interface ScribeAnalysis {
    intent: UserIntent;
    expandedQuery: string;
    requiresRetrieval: boolean;
}

// Medical synonym map (Can be expanded or backed by a real terminology DB later)
const MEDICAL_SYNONYMS: Record<string, string[]> = {
    'appendicitis': ['appendix', 'appendiceal', 'rlq', 'mcburney'],
    'cholecystitis': ['gallbladder', 'gallstone', 'cholelithiasis', 'biliary'],
    'pancreatitis': ['pancreas', 'pancreatic', 'ranson'],
    'hernia': ['inguinal', 'femoral', 'umbilical', 'incisional', 'hiatal'],
    'cancer': ['carcinoma', 'malignancy', 'tumor', 'tumour', 'oncology', 'staging'],
    'obstruction': ['bowel', 'intestinal', 'ileus', 'volvulus'],
    'bleeding': ['hemorrhage', 'haemorrhage', 'gi bleed', 'hematemesis', 'melena'],
    'liver': ['hepatic', 'hepatobiliary', 'cirrhosis', 'portal'],
    'esophagus': ['esophageal', 'oesophagus', 'gerd', 'achalasia', 'dysphagia'],
    'stomach': ['gastric', 'peptic', 'ulcer', 'pyloric'],
    'colon': ['colorectal', 'colonic', 'rectal', 'sigmoid'],
    'thyroid': ['thyroidectomy', 'graves', 'hashimoto', 'goiter'],
    'breast': ['mastectomy', 'fibroadenoma', 'mammography'],
};

function expandKeywords(query: string): string {
    const words = query.toLowerCase().split(/\s+/);
    const expanded = new Set(words);

    for (const word of words) {
        for (const [root, syns] of Object.entries(MEDICAL_SYNONYMS)) {
            if (word.includes(root) || syns.some(s => word.includes(s))) {
                expanded.add(root);
                syns.forEach(s => expanded.add(s));
            }
        }
    }
    return Array.from(expanded).join(' ');
}

export async function analyzeIntent(query: string, history: any[]): Promise<ScribeAnalysis> {
    const lowerQuery = query.toLowerCase();

    let intent: UserIntent = 'learn';
    let requiresRetrieval = true;

    // Basic heuristic intent classification (Will be upgraded to a fast LLM call if needed)
    if (lowerQuery.includes('quiz') || lowerQuery.includes('mcq') || lowerQuery.includes('test')) {
        intent = 'practice';
    } else if (lowerQuery.includes('review') || lowerQuery.includes('summarize') || lowerQuery.includes('summary')) {
        intent = 'review';
    } else if (lowerQuery.includes('diff') || lowerQuery.includes('vs') || lowerQuery.includes('versus')) {
        intent = 'differentiate';
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || (lowerQuery.length < 15 && !lowerQuery.includes('what'))) {
        // If it's a simple greeting or very short non-question, skip DB lookup
        intent = 'chit_chat';
        requiresRetrieval = false;
    }

    const expandedQuery = expandKeywords(lowerQuery);

    return {
        intent,
        expandedQuery,
        requiresRetrieval
    };
}
