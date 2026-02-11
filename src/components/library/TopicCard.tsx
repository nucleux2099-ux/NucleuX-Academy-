'use client'

import Link from 'next/link'

interface TopicCardProps {
  id: string
  name: string
  system: string
  priority?: string
  difficulty?: string
  tags?: string[]
  hasExplorer?: boolean
  hasExamPrep?: boolean
  hasTextbook?: boolean
  hasRetrievalCards?: boolean
  hasProcedure?: boolean
}

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  hard: 'bg-red-500/20 text-red-400',
}

export function TopicCard({
  id,
  name,
  system,
  priority = 'medium',
  difficulty = 'medium',
  tags = [],
  hasExplorer,
  hasExamPrep,
  hasTextbook,
  hasRetrievalCards,
  hasProcedure,
}: TopicCardProps) {
  const modes = [
    { key: 'explorer', icon: '🔍', label: 'Explorer', available: hasExplorer },
    { key: 'exam-prep', icon: '📋', label: 'Exam Prep', available: hasExamPrep },
    { key: 'textbook', icon: '📖', label: 'Textbook', available: hasTextbook },
    { key: 'cards', icon: '🎴', label: 'Cards', available: hasRetrievalCards },
    { key: 'procedure', icon: '🔧', label: 'Procedure', available: hasProcedure },
  ]

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 hover:border-blue-500/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-lg">{name}</h3>
          <p className="text-gray-400 text-sm">{system}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[priority]}`}>
            {priority}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-500 text-xs">
              +{tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Available Modes */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
        {modes.map((mode) => (
          <Link
            key={mode.key}
            href={mode.available ? `/library/${system}/${id}/${mode.key}` : '#'}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
              mode.available
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 cursor-pointer'
                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{mode.icon}</span>
            <span className="hidden sm:inline">{mode.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
