'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ hours, minutes, seconds }: CountdownTimerProps) {
  const [time, setTime] = useState({ hours, minutes, seconds });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {[
        { value: time.hours, label: 'Hours' },
        { value: time.minutes, label: 'Minutes' },
        { value: time.seconds, label: 'Seconds' },
      ].map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2">
          {idx > 0 && <span className="text-2xl font-bold text-[#94A3B8]">:</span>}
          <div className="text-center">
            <div className="bg-[#364A5E] rounded-xl px-3 py-2 min-w-[50px] shadow-lg border border-[rgba(91,179,179,0.15)]">
              <span className="text-2xl font-bold text-[#5BB3B3]">{String(unit.value).padStart(2, "0")}</span>
            </div>
            <span className="text-xs text-[#A0B0BC] mt-1 block">{unit.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
