import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type CampusRoom = {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  atomRole: string;
  bullets: string[];
};

export function RoomCard({ room }: { room: CampusRoom }) {
  return (
    <Link href={room.href} className="block">
      <Card
        className={cn(
          'group bg-[#364A5E]/70 border-[rgba(232,224,213,0.10)] hover:border-[rgba(232,224,213,0.18)] transition-all',
          'hover:-translate-y-0.5'
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center border"
                  style={{ backgroundColor: `${room.color}18`, borderColor: `${room.color}33`, color: room.color }}
                >
                  <div className="text-xl">{room.icon}</div>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#E8E0D5] truncate">{room.name}</h3>
                  <p className="text-sm text-[#A0B0BC] truncate">{room.description}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge
                  className="border"
                  style={{ backgroundColor: `${room.color}18`, borderColor: `${room.color}33`, color: room.color }}
                >
                  {room.atomRole}
                </Badge>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-[#A0B0BC]">
                {room.bullets.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span style={{ color: room.color }} className="mt-1">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="shrink-0 text-sm text-[#A0B0BC] group-hover:text-[#E8E0D5] transition-colors">
              →
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
