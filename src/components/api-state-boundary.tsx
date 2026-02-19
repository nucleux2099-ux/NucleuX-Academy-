'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ApiStateBoundaryProps<T> = {
  isLoading: boolean;
  error: Error | null;
  data: T | null | undefined;
  loadingText?: string;
  errorText?: string;
  className?: string;
  children: React.ReactNode;
};

export function ApiStateBoundary<T>({
  isLoading,
  error,
  data,
  loadingText = 'Loading...',
  errorText = 'Unable to load data right now.',
  className,
  children,
}: ApiStateBoundaryProps<T>) {
  if (isLoading && !data) {
    return (
      <div className={cn('min-h-screen p-6', className)}>
        <div className="bg-[#253545] rounded-xl p-5 border border-[#5BB3B3]/20 text-[#A0B0BC]">
          {loadingText}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className={cn('min-h-screen p-6', className)}>
        <div className="bg-[#253545] rounded-xl p-5 border border-red-400/20 text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {errorText}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
