'use client'

import { useState, useCallback } from 'react'
import { Plus, Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { MedicalMarkdown } from '@/components/MedicalMarkdown'

interface ContentViewerProps {
  content: string
  mode: 'explorer' | 'exam-prep' | 'textbook' | 'procedure'
  title: string
  breadcrumbs?: { label: string; href?: string }[]
}

const modeStyles: Record<string, { bg: string; accent: string; icon: string }> = {
  explorer: {
    bg: 'from-purple-500/10 to-blue-500/10',
    accent: 'text-purple-400',
    icon: '🔍',
  },
  'exam-prep': {
    bg: 'from-green-500/10 to-teal-500/10',
    accent: 'text-green-400',
    icon: '📋',
  },
  textbook: {
    bg: 'from-orange-500/10 to-red-500/10',
    accent: 'text-orange-400',
    icon: '📖',
  },
  procedure: {
    bg: 'from-blue-500/10 to-cyan-500/10',
    accent: 'text-blue-400',
    icon: '🔧',
  },
}

export function ContentViewer({ content, mode, title, breadcrumbs }: ContentViewerProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base')
  const [addedToDesk, setAddedToDesk] = useState(false)
  const style = modeStyles[mode] || modeStyles.textbook

  const handleAddToDesk = useCallback(() => {
    setAddedToDesk(true)
    setTimeout(() => setAddedToDesk(false), 2000)
  }, [])

  const fontSizeClasses = {
    sm: 'prose-sm',
    base: 'prose-base',
    lg: 'prose-lg',
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${style.bg}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-6 py-4">
        <div className="flex flex-col gap-2 max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-sm text-gray-400">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight size={14} className="text-gray-600" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-teal-400 transition-colors">{crumb.label}</Link>
                  ) : (
                    <span className="text-gray-300">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{style.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              <span className={`text-sm ${style.accent} capitalize`}>{mode.replace('-', ' ')} Mode</span>
            </div>
          </div>
          
          {/* Add to Desk Button */}
          <button
            onClick={handleAddToDesk}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              addedToDesk
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
            }`}
          >
            {addedToDesk ? <Check size={16} /> : <Plus size={16} />}
            {addedToDesk ? 'Added to Desk!' : 'Add to My Desk'}
          </button>

          {/* Font Size Controls */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
            {(['sm', 'base', 'lg'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  fontSize === size
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {size === 'sm' ? 'A' : size === 'base' ? 'A' : 'A'}
                <span className="sr-only">{size}</span>
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className={fontSizeClasses[fontSize]}>
          <MedicalMarkdown content={content} />
        </div>
      </div>
    </div>
  )
}
