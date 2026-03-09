import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isFeatureEnabled } from '@/lib/features/flags';
import {
  QUICK_START_MAX_REQUIRED_FIELDS,
  QUICK_START_REQUIRED_FIELDS,
  type QuickStartRequiredField,
} from '@/lib/atom/quick-start-schema';

const FIELD_LABELS: Record<QuickStartRequiredField, string> = {
  mode: 'Mode',
  topic: 'Subject / topic',
  level: 'Level',
  timeAvailable: 'Time available (minutes)',
  goal: 'Learning goal',
};

export default function AtomIntentCardPage() {
  if (!isFeatureEnabled('atomPhase2Scaffold') || !isFeatureEnabled('atomIntentCard')) {
    notFound();
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <Card className="mx-auto w-full max-w-3xl border-slate-700 bg-slate-900/70 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-slate-50">ATOM Intent Card (Phase 2 scaffold)</h1>
          <Badge className="border-cyan-500/40 bg-cyan-500/10 text-cyan-200">Flagged</Badge>
        </div>

        <p className="mt-2 text-sm text-slate-300">
          Shell route only. This page intentionally avoids workflow logic and is safe to merge ahead of full implementation.
        </p>

        <div className="mt-5 rounded-lg border border-slate-700 bg-slate-950/60 p-4">
          <h2 className="text-sm font-medium text-slate-100">Quick-start required fields</h2>
          <p className="mt-1 text-xs text-slate-400">
            Shared schema is capped at {QUICK_START_MAX_REQUIRED_FIELDS} required fields for v0 scaffold.
          </p>

          <ul className="mt-3 space-y-2">
            {QUICK_START_REQUIRED_FIELDS.map((field) => (
              <li key={field} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2">
                <span className="text-sm text-slate-200">{FIELD_LABELS[field]}</span>
                <Badge className="border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-200">Required</Badge>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
