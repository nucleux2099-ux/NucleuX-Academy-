import { redirect } from 'next/navigation';
import GuidedDeepDiveExperience from '@/components/atom/GuidedDeepDiveExperience';
import { isAtomV3Enabled, isAtomV3GddEnabled } from '@/lib/features/flags';

export default function GuidedDeepDivePage() {
  if (!isAtomV3Enabled() || !isAtomV3GddEnabled()) {
    redirect('/atom-v3');
  }

  return <GuidedDeepDiveExperience />;
}
