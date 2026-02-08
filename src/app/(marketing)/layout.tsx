import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ATOM - Atomic Teaching & Optimization Model | NucleuX Academy',
  description: 'Transform complex medical concepts into atomic units of understanding with AI-powered learning. Learn Medicine Like Never Before.',
  keywords: ['medical education', 'AI learning', 'MBBS', 'medical students', 'ATOM', 'NucleuX'],
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {children}
    </div>
  )
}
