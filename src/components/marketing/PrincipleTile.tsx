import { Card, CardContent } from '@/components/ui/card';

export function PrincipleTile({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-[#364A5E]/55 border-[rgba(232,224,213,0.10)]">
      <CardContent className="p-5">
        <h4 className="text-sm font-semibold text-[#E8E0D5]">{title}</h4>
        <p className="mt-1 text-sm text-[#A0B0BC]">{description}</p>
      </CardContent>
    </Card>
  );
}
