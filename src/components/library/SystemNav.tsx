'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface System {
  id: string
  name: string
  icon: string
  topicCount: number
}

const systems: System[] = [
  { id: '01-general-topics', name: 'General Topics', icon: '🏥', topicCount: 12 },
  { id: '02-head-neck', name: 'Head & Neck', icon: '🗣️', topicCount: 7 },
  { id: '03-breast', name: 'Breast', icon: '🩺', topicCount: 6 },
  { id: '04-thorax', name: 'Thorax', icon: '🫁', topicCount: 6 },
  { id: '05-upper-gi', name: 'Upper GI', icon: '🍽️', topicCount: 7 },
  { id: '06-hepatobiliary', name: 'Hepatobiliary', icon: '🫀', topicCount: 13 },
  { id: '07-pancreas', name: 'Pancreas', icon: '🧬', topicCount: 3 },
  { id: '08-small-intestine', name: 'Small Intestine', icon: '🔄', topicCount: 7 },
  { id: '09-colon-rectum', name: 'Colon & Rectum', icon: '📍', topicCount: 7 },
  { id: '10-anorectal', name: 'Anorectal', icon: '🔴', topicCount: 6 },
  { id: '11-hernias', name: 'Hernias', icon: '🔲', topicCount: 6 },
  { id: '12-urology', name: 'Urology', icon: '💧', topicCount: 10 },
  { id: '13-vascular', name: 'Vascular', icon: '🩸', topicCount: 8 },
  { id: '14-procedures', name: 'Procedures', icon: '🔧', topicCount: 15 },
]

export function SystemNav() {
  const pathname = usePathname()
  const currentSystem = pathname?.split('/')[2] || ''

  return (
    <nav className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Systems</h2>
      <div className="space-y-1">
        {systems.map((system) => {
          const isActive = currentSystem === system.id
          return (
            <Link
              key={system.id}
              href={`/library/${system.id}`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{system.icon}</span>
                <span className="text-sm">{system.name}</span>
              </div>
              <span className="text-xs text-gray-500">{system.topicCount}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
