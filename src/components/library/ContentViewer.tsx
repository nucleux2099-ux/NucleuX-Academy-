'use client'

import { useState, useCallback } from 'react'
import { Plus, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ContentViewerProps {
  content: string
  mode: 'explorer' | 'exam-prep' | 'textbook' | 'procedure'
  title: string
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

export function ContentViewer({ content, mode, title }: ContentViewerProps) {
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
        <div className="flex items-center justify-between max-w-4xl mx-auto">
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <article
          className={`prose prose-invert ${fontSizeClasses[fontSize]} max-w-none
            prose-headings:text-white
            prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6
            prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-700
            prose-h3:text-xl prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-pink-400 prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-800/80 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-xl
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-gray-300 prose-blockquote:not-italic
            prose-table:border-collapse
            prose-th:bg-gray-800 prose-th:text-white prose-th:font-semibold prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-gray-700
            prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-700 prose-td:text-gray-300
            prose-li:text-gray-300
            prose-hr:border-gray-700
          `}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
