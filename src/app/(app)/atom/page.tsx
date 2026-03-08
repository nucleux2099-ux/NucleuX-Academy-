import { redirect } from 'next/navigation';
import LegacyAtomWorkspace from '@/components/atom/LegacyAtomWorkspace';
import { isAtomV3Enabled } from '@/lib/features/flags';

export default function AtomEntryPage() {
  if (isAtomV3Enabled()) {
    redirect('/atom-v3');
  }

  return <LegacyAtomWorkspace />;
}
