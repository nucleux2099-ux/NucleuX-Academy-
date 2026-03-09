/**
 * NucleuX Academy - ATOM v2: Chat API Route
 *
 * POST /api/atom/chat
 *
 * Authenticates the user via Supabase JWT (cookie-based SSR),
 * parses the ATOMChatRequest body, and delegates to the Gateway
 * orchestrator which returns an SSE stream.
 *
 * Spec: docs/specs/ATOM_GATEWAY_SPEC.md § API Route Implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processGatewayRequest, GatewayError } from '@/lib/atom/gateway';
import type { ATOMChatRequest } from '@/lib/types/atom';

// =============================================================================
// VALIDATION
// =============================================================================

const VALID_ROOMS = new Set([
  'desk',
  'library',
  'classroom',
  'training',
  'cbme',
  'community',
  'arena',
  'backstage',
  'studio',
]);

/**
 * Validate the incoming request body against ATOMChatRequest shape.
 * Returns a descriptive error string or null if valid.
 */
function validateRequest(body: unknown): string | null {
  if (!body || typeof body !== 'object') {
    return 'Request body must be a JSON object';
  }

  const req = body as Record<string, unknown>;

  if (typeof req.message !== 'string' || req.message.trim().length === 0) {
    return 'message is required and must be a non-empty string';
  }

  if (req.message.length > 10_000) {
    return 'message must be 10,000 characters or fewer';
  }

  if (typeof req.room !== 'string' || !VALID_ROOMS.has(req.room)) {
    return `room must be one of: ${[...VALID_ROOMS].join(', ')}`;
  }

  if (req.conversationId !== undefined && typeof req.conversationId !== 'string') {
    return 'conversationId must be a string if provided';
  }

  if (req.pageContext !== undefined && typeof req.pageContext !== 'object') {
    return 'pageContext must be an object if provided';
  }

  return null;
}

// =============================================================================
// ROUTE HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  // -------------------------------------------------------------------------
  // Phase 1: Authenticate via Supabase JWT (cookie-based SSR)
  // -------------------------------------------------------------------------
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'AUTH_FAILED' },
      { status: 401 }
    );
  }

  // -------------------------------------------------------------------------
  // Phase 2: Parse and validate request body
  // -------------------------------------------------------------------------
  let body: ATOMChatRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body', code: 'INVALID_JSON' },
      { status: 400 }
    );
  }

  const validationError = validateRequest(body);
  if (validationError) {
    return NextResponse.json(
      { error: validationError, code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  // -------------------------------------------------------------------------
  // Phase 3: Delegate to Gateway orchestrator
  // -------------------------------------------------------------------------
  try {
    const stream = processGatewayRequest({
      userId: user.id,
      room: body.room,
      message: body.message.trim(),
      conversationId: body.conversationId,
      pageContext: body.pageContext,
      model: body.model,
      signal: request.signal,
    });

    // Return SSE stream
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable Nginx buffering
      },
    });
  } catch (error) {
    // Handle known Gateway errors
    if (error instanceof GatewayError) {
      const statusCode = gatewayErrorToStatus(error.code);
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          degraded: error.degraded,
        },
        { status: statusCode }
      );
    }

    // Unknown errors
    console.error('[atom/chat] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Map Gateway error codes to HTTP status codes.
 */
function gatewayErrorToStatus(code: string): number {
  switch (code) {
    case 'AUTH_FAILED':
      return 401;
    case 'VALIDATION_ERROR':
      return 400;
    case 'QUEUE_FULL':
      return 429;
    case 'RATE_LIMITED':
      return 429;
    case 'GENERATION_FAILED':
      return 502;
    case 'PARTIAL_DEGRADATION':
      return 200; // Still return 200 — degradation is reported via SSE events
    default:
      return 500;
  }
}
