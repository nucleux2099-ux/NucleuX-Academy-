import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function RoomPreviewCard({
  title,
  description,
  atomRole,
  href,
  imageSrc,
  color,
}: {
  title: string;
  description: string;
  atomRole: string;
  href: string;
  imageSrc: string;
  color: string;
}) {
  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          'group relative overflow-hidden bg-[#364A5E]/55',
          'border-[rgba(232,224,213,0.10)] hover:border-[rgba(232,224,213,0.20)]',
          'transition-all duration-300 hover:-translate-y-1 hover:shadow-matte-lg'
        )}
      >
        <div className="relative aspect-[16/9]">
          <Image
            src={imageSrc}
            alt={`${title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover opacity-[0.95] group-hover:opacity-100 transition-opacity"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge
              className="border"
              style={{ backgroundColor: `${color}18`, borderColor: `${color}33`, color }}
            >
              {atomRole}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="text-lg font-bold text-[#E8E0D5]">{title}</div>
          <div className="mt-1 text-sm text-[#A0B0BC]">{description}</div>
          <div className="mt-4 text-sm text-[#A0B0BC] group-hover:text-[#E8E0D5] transition-colors">
            Explore this room →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
