import { resolve } from 'path';
import * as dotenv from 'dotenv';

// 1. Load environment variables FIRST
dotenv.config({ path: resolve(__dirname, '../.env.local') });

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ WARNING: SUPABASE_SERVICE_ROLE_KEY is missing from .env.local');
    // fallback for testing if user has it exported in shell
    process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️ WARNING: ANTHROPIC_API_KEY is missing. Claude generation will fail.');
}

async function runTest() {
    console.log('🚀 Starting ATOM v2 Gateway Smoke Test...\n');

    // 2. Dynamically import the gateway ONLY AFTER process.env is populated
    const { processGatewayRequest } = await import('../src/lib/atom/gateway');

    // Hardcode a mock user ID (can be any UUID for testing)
    const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

    const input = {
        userId: TEST_USER_ID,
        room: 'library' as any, // Using library room to test standard retrieval
        message: 'Explain the pathophysiology of Type 1 Respiratory Failure.',
        pageContext: {
            room: 'library' as any,
            subject: 'Medicine',
            topicSlug: 'respiratory-failure'
        }
    };

    console.log('📦 Input Payload:');
    console.log(JSON.stringify(input, null, 2));
    console.log('\n⏳ Invoking Orcehstrator Pipeline (SSE Stream)...\n');

    try {
        const stream = processGatewayRequest(input);
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                console.log('\n\n✅ Stream Complete.');
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (!data || data === '[DONE]') continue;

                try {
                    const event = JSON.parse(data);

                    switch (event.type) {
                        case 'agent_start':
                            console.log(`\n▶️  [AGENT START] ${event.agentId}: ${event.label}`);
                            break;
                        case 'agent_complete':
                            console.log(`⏹️  [AGENT DONE]  ${event.agentId}: ${event.resultSummary || 'Finished'}`);
                            break;
                        case 'content_delta':
                            process.stdout.write(event.content); // Stream Claude text directly
                            break;
                        case 'content_complete':
                            console.log(`\n\n💾 [SAVED] Conversation ID: ${event.conversationId}`);
                            break;
                        case 'error':
                            console.error(`\n❌ [ERROR] ${event.code}: ${event.message}`);
                            break;
                        // default:
                        //   console.log(`\n[EVENT] ${event.type}`, event);
                    }
                } catch (e) {
                    // Ignored parse error for partial lines
                }
            }
        }
    } catch (error) {
        console.error('\n💥 Gateway Execution Failed:', error);
    }
}

runTest();
