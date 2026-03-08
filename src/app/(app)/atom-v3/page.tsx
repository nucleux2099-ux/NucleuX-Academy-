import { redirect } from 'next/navigation';
import AtomV3Experience from '@/components/atom/AtomV3Experience';
import { isAtomV3AdvancedVisible, isAtomV3Enabled } from '@/lib/features/flags';

export default function AtomV3Page() {
  if (!isAtomV3Enabled()) {
    redirect('/atom');
  }

  return <AtomV3Experience advancedVisible={isAtomV3AdvancedVisible()} />;
}
