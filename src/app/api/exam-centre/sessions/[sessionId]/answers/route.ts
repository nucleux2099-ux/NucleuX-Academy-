import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/learning/api';

type SessionRow = {
  id: string;
  ended_at: string | null;
  mcqs_attempted: number | null;
  mcqs_correct: number | null;
};

type OptionRow = {
  id: string;
  option_order: number;
  is_correct: boolean;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function toNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}

function normalizeOptionKey(value: string) {
  return value.trim().toLowerCase();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;

    if (!sessionId || !isUuid(sessionId)) {
      return NextResponse.json({ error: 'Invalid session id' }, { status: 400 });
    }

    const auth = await requireAuth();
    if (auth.unauthorized) return auth.unauthorized;
    const { supabase, userId } = auth;

    const { data: sessionData, error: sessionError } = await supabase
      .from('study_sessions')
      .select('id,ended_at,mcqs_attempted,mcqs_correct')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single();

    if (sessionError || !sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = sessionData as SessionRow;
    if (session.ended_at) {
      return NextResponse.json({ error: 'Session already submitted' }, { status: 409 });
    }

    const body = await request.json();

    const mcqId = typeof body?.mcq_id === 'string' ? body.mcq_id : '';
    const questionRef =
      typeof body?.question_ref === 'string' ? body.question_ref.trim() : '';

    if (!mcqId && !questionRef) {
      return NextResponse.json(
        { error: 'Either mcq_id or question_ref is required' },
        { status: 400 }
      );
    }

    const timeTakenSecondsRaw = toNumber(body?.time_taken_seconds);
    const timeTakenSeconds =
      timeTakenSecondsRaw !== null && timeTakenSecondsRaw >= 0
        ? Math.round(timeTakenSecondsRaw)
        : null;

    const confidenceRaw = toNumber(body?.confidence);
    const confidence =
      confidenceRaw !== null && Number.isInteger(confidenceRaw) && confidenceRaw >= 1 && confidenceRaw <= 5
        ? confidenceRaw
        : null;

    let isCorrect = false;
    let attemptId = '';
    let createdAt = new Date().toISOString();

    let mcqResponse: {
      mcqId: string;
      selectedOptionIds: string[];
      correctOptionIds: string[];
    } | null = null;

    let templateResponse: {
      questionRef: string;
      selectedOptionKey: string | null;
      selectedOptionKeys: string[];
      correctOptionKey: string | null;
    } | null = null;

    if (mcqId) {
      if (!isUuid(mcqId)) {
        return NextResponse.json({ error: 'Invalid mcq_id' }, { status: 400 });
      }

      const { data: mcqData, error: mcqError } = await supabase
        .from('mcqs')
        .select('id,is_published')
        .eq('id', mcqId)
        .eq('is_published', true)
        .single();

      if (mcqError || !mcqData) {
        return NextResponse.json({ error: 'MCQ not found' }, { status: 404 });
      }

      const { data: optionsData, error: optionsError } = await supabase
        .from('mcq_options')
        .select('id,option_order,is_correct')
        .eq('mcq_id', mcqId)
        .order('option_order', { ascending: true });

      if (optionsError) {
        console.error('MCQ options fetch error:', optionsError);
        return NextResponse.json({ error: 'Failed to load MCQ options' }, { status: 500 });
      }

      const options = (optionsData || []) as OptionRow[];
      if (!options.length) {
        return NextResponse.json({ error: 'MCQ options are unavailable' }, { status: 422 });
      }

      const selectedFromIds = Array.isArray(body?.selected_option_ids)
        ? body.selected_option_ids.filter((value: unknown): value is string => {
            return typeof value === 'string' && isUuid(value);
          })
        : [];

      const selectedSingle =
        typeof body?.selected_option_id === 'string' && isUuid(body.selected_option_id)
          ? [body.selected_option_id]
          : [];

      const selectedOrders = Array.isArray(body?.selected_option_orders)
        ? body.selected_option_orders
            .map((value: unknown) => toNumber(value))
            .filter(
              (value: number | null): value is number =>
                value !== null && Number.isInteger(value) && value > 0
            )
        : [];

      const selectedSingleOrder = toNumber(body?.selected_option_order);
      const normalizedSingleOrder =
        selectedSingleOrder !== null && Number.isInteger(selectedSingleOrder) && selectedSingleOrder > 0
          ? [selectedSingleOrder]
          : [];

      const optionsByOrder = new Map(options.map((option) => [option.option_order, option.id] as const));

      const selectedFromOrders = [...selectedOrders, ...normalizedSingleOrder]
        .map((order) => optionsByOrder.get(order) || null)
        .filter((value): value is string => Boolean(value));

      const selectedOptionIds = uniqueStrings([
        ...selectedFromIds,
        ...selectedSingle,
        ...selectedFromOrders,
      ]);

      if (!selectedOptionIds.length) {
        return NextResponse.json({ error: 'At least one selected option is required' }, { status: 400 });
      }

      const validOptionIds = new Set(options.map((option) => option.id));
      const sanitizedSelectedOptionIds = selectedOptionIds.filter((id) => validOptionIds.has(id));

      if (!sanitizedSelectedOptionIds.length) {
        return NextResponse.json({ error: 'Selected options do not match this MCQ' }, { status: 400 });
      }

      const correctOptionIds = options.filter((option) => option.is_correct).map((option) => option.id);
      const selectedSet = new Set(sanitizedSelectedOptionIds);
      const correctSet = new Set(correctOptionIds);

      isCorrect =
        selectedSet.size === correctSet.size &&
        Array.from(correctSet).every((id) => selectedSet.has(id));

      const { data: attemptData, error: attemptError } = await supabase
        .from('mcq_attempts')
        .insert({
          user_id: userId,
          mcq_id: mcqId,
          selected_options: sanitizedSelectedOptionIds,
          is_correct: isCorrect,
          time_taken_seconds: timeTakenSeconds,
          confidence,
          session_id: sessionId,
        })
        .select('id,created_at')
        .single();

      if (attemptError || !attemptData) {
        console.error('MCQ attempt insert error:', attemptError);
        return NextResponse.json({ error: 'Failed to record attempt' }, { status: 500 });
      }

      attemptId = attemptData.id;
      createdAt = attemptData.created_at;
      mcqResponse = {
        mcqId,
        selectedOptionIds: sanitizedSelectedOptionIds,
        correctOptionIds,
      };
    } else {
      const selectedOptionKey =
        typeof body?.selected_option_key === 'string' ? normalizeOptionKey(body.selected_option_key) : null;

      const selectedOptionKeys = Array.isArray(body?.selected_option_keys)
        ? uniqueStrings(
            body.selected_option_keys
              .filter((value: unknown): value is string => typeof value === 'string' && value.trim().length > 0)
              .map((value: string) => normalizeOptionKey(value))
          )
        : [];

      if (!selectedOptionKey && !selectedOptionKeys.length) {
        return NextResponse.json(
          { error: 'selected_option_key or selected_option_keys is required for question_ref attempts' },
          { status: 400 }
        );
      }

      const correctOptionKey =
        typeof body?.correct_option_key === 'string'
          ? normalizeOptionKey(body.correct_option_key)
          : null;

      const explicitIsCorrect =
        typeof body?.is_correct === 'boolean' ? body.is_correct : null;

      if (explicitIsCorrect === null && !correctOptionKey) {
        return NextResponse.json(
          { error: 'Provide is_correct or correct_option_key for question_ref attempts' },
          { status: 400 }
        );
      }

	      if (explicitIsCorrect !== null) {
	        isCorrect = explicitIsCorrect;
	      } else {
        const selectedValues = selectedOptionKeys.length
          ? selectedOptionKeys
          : selectedOptionKey
            ? [selectedOptionKey]
            : [];
	        isCorrect = Boolean(correctOptionKey && selectedValues.includes(correctOptionKey));
	      }

	      const metadata = isRecord(body?.metadata) ? body.metadata : null;

	      const { data: eventData, error: eventError } = await supabase
	        .from('analytics_events')
	        .insert({
          user_id: userId,
          event_name: 'exam_answer',
          event_data: {
            session_id: sessionId,
            question_ref: questionRef,
            mode: typeof body?.mode === 'string' ? body.mode : null,
            selected_option_key: selectedOptionKey,
            selected_option_keys: selectedOptionKeys,
	            correct_option_key: correctOptionKey,
	            is_correct: isCorrect,
	            confidence,
	            time_taken_seconds: timeTakenSeconds,
	            metadata,
	          },
	        })
        .select('id,created_at')
        .single();

      if (eventError || !eventData) {
        console.error('Template answer analytics event insert error:', eventError);
        return NextResponse.json({ error: 'Failed to record template attempt' }, { status: 500 });
      }

      attemptId = eventData.id;
      createdAt = eventData.created_at;
      templateResponse = {
        questionRef,
        selectedOptionKey,
        selectedOptionKeys,
        correctOptionKey,
      };
    }

    const nextAttempted = (session.mcqs_attempted || 0) + 1;
    const nextCorrect = (session.mcqs_correct || 0) + (isCorrect ? 1 : 0);

    const { error: sessionUpdateError } = await supabase
      .from('study_sessions')
      .update({
        mcqs_attempted: nextAttempted,
        mcqs_correct: nextCorrect,
      })
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (sessionUpdateError) {
      console.error('Session MCQ counter update error:', sessionUpdateError);
    }

    const today = new Date().toISOString().slice(0, 10);
    const { error: dailyStatsError } = await supabase.rpc('increment_mcq_stats', {
      p_user_id: userId,
      p_date: today,
      p_attempted: 1,
      p_correct: isCorrect ? 1 : 0,
    });
    if (dailyStatsError) {
      console.warn('increment_mcq_stats failed for exam session answer:', dailyStatsError.message);
    }

    return NextResponse.json({
      attemptId,
      createdAt,
      isCorrect,
      ...(mcqResponse || {}),
      ...(templateResponse || {}),
      session: {
        id: sessionId,
        mcqsAttempted: nextAttempted,
        mcqsCorrect: nextCorrect,
      },
    });
  } catch (error) {
    console.error('Exam session answer POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
