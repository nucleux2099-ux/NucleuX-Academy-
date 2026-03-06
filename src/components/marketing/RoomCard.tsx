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

export function RoomCard({
  room,
  variant = 'default',
}: {
  room: CampusRoom;
  variant?: 'default' | 'featured';
}) {
  const isFeatured = variant === 'featured';

  return (
    <Link href={room.href} className="block">
      <Card
        className={cn(
          'group relative overflow-hidden',
          'bg-[#364A5E]/55 border-[rgba(232,224,213,0.10)]',
          'hover:border-[rgba(232,224,213,0.20)] transition-all duration-300',
          'hover:-translate-y-1 hover:shadow-matte-lg'
        )}
      >
        {/* subtle glow */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: `${room.color}22` }}
        />

        <CardContent className={cn('p-6', isFeatured && 'p-7')}> 
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'rounded-2xl flex items-center justify-center border',
                    isFeatured ? 'w-12 h-12' : 'w-11 h-11'
                  )}
                  style={{ backgroundColor: `${room.color}18`, borderColor: `${room.color}33`, color: room.color }}
                >
                  <div className={cn(isFeatured ? 'text-2xl' : 'text-xl')}>{room.icon}</div>
                </div>
                <div className="min-w-0">
                  <h3 className={cn('font-bold text-[#E8E0D5] truncate', isFeatured ? 'text-xl' : 'text-lg')}>
                    {room.name}
                  </h3>
                  <p className={cn('text-[#A0B0BC]', isFeatured ? 'text-sm' : 'text-sm')}>
                    {room.description}
                  </p>
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

              {/* premium: fewer bullets */}
              <ul className={cn('mt-4 space-y-2 text-sm text-[#A0B0BC]', isFeatured && 'text-[0.95rem]')}>
                {room.bullets.slice(0, 2).map((b) => (
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
