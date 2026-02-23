'use client'

import { useEffect, useState } from 'react'
import Shepherd from 'shepherd.js'
import type { Tour } from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'

// Custom styles for the tour
const tourStyles = `
  .shepherd-element {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.15);
    max-width: 400px;
  }
  
  .shepherd-content {
    padding: 0;
  }
  
  .shepherd-header {
    background: transparent;
    padding: 20px 20px 0 20px;
    border: none;
  }
  
  .shepherd-title {
    color: #f1f5f9;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .shepherd-cancel-icon {
    color: #64748b;
    font-size: 24px;
  }
  
  .shepherd-cancel-icon:hover {
    color: #94a3b8;
  }
  
  .shepherd-text {
    color: #cbd5e1;
    padding: 12px 20px 20px 20px;
    font-size: 14px;
    line-height: 1.6;
  }
  
  .shepherd-footer {
    padding: 0 20px 20px 20px;
    border: none;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  
  .shepherd-button {
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .shepherd-button-secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;
  }
  
  .shepherd-button-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f1f5f9;
  }
  
  .shepherd-button-primary {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    border: none;
    color: white;
  }
  
  .shepherd-button-primary:hover {
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
  }
  
  .shepherd-arrow:before {
    background: #1e293b;
    border: 1px solid rgba(6, 182, 212, 0.3);
  }
  
  .shepherd-modal-overlay-container {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
  }
  
  .shepherd-target-highlight {
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.4), 0 0 20px rgba(6, 182, 212, 0.2);
    border-radius: 12px;
  }
  
  .tour-step-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    border-radius: 50%;
    font-size: 12px;
    font-weight: 600;
    color: white;
    margin-right: 8px;
  }
  
  .tour-emoji {
    font-size: 20px;
    margin-right: 8px;
  }
`

interface DemoTourProps {
  onComplete?: () => void
  onSkip?: () => void
}

export function DemoTour({ onComplete, onSkip }: DemoTourProps) {
  const [_tour, setTour] = useState<Tour | null>(null)

  useEffect(() => {
    // Inject custom styles
    const styleSheet = document.createElement('style')
    styleSheet.textContent = tourStyles
    document.head.appendChild(styleSheet)

    // Create the tour
    const shepherdTour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: { behavior: 'smooth', block: 'center' },
        modalOverlayOpeningRadius: 12,
        modalOverlayOpeningPadding: 8,
      },
    })

    // Step 1: Welcome
    shepherdTour.addStep({
      id: 'welcome',
      title: '<span class="tour-emoji">🧬</span> Welcome to ATOM Demo!',
      text: `
        <p>Hey there! I'm <strong>ATOM</strong> — your AI-powered medical learning companion.</p>
        <p style="margin-top: 12px;">Let me show you around in <strong>30 seconds</strong>. Ready?</p>
      `,
      buttons: [
        {
          text: 'Skip Tour',
          action: () => {
            shepherdTour.cancel()
            onSkip?.()
          },
          classes: 'shepherd-button-secondary',
        },
        {
          text: "Let's Go! →",
          action: shepherdTour.next,
          classes: 'shepherd-button-primary',
        },
      ],
    })

    // Step 2: Library Selector
    shepherdTour.addStep({
      id: 'library',
      title: '<span class="tour-step-badge">1</span> Choose Your Subject',
      text: `
        <p>Start by picking a <strong>medical subject</strong> from the library.</p>
        <p style="margin-top: 12px; color: #06b6d4;">Try clicking <strong>Anatomy</strong>, <strong>Physiology</strong>, or <strong>Biochemistry</strong>.</p>
      `,
      attachTo: {
        element: '[data-tour="library-selector"]',
        on: 'right',
      },
      buttons: [
        {
          text: '← Back',
          action: shepherdTour.back,
          classes: 'shepherd-button-secondary',
        },
        {
          text: 'Next →',
          action: shepherdTour.next,
          classes: 'shepherd-button-primary',
        },
      ],
    })

    // Step 3: Topic Selector
    shepherdTour.addStep({
      id: 'topics',
      title: '<span class="tour-step-badge">2</span> Pick a Topic',
      text: `
        <p>Each subject has multiple <strong>topics</strong> to explore.</p>
        <p style="margin-top: 12px;">In the full version, you'll have access to <strong>1000+ topics</strong> across all subjects!</p>
      `,
      attachTo: {
        element: '[data-tour="topic-selector"]',
        on: 'right',
      },
      buttons: [
        {
          text: '← Back',
          action: shepherdTour.back,
          classes: 'shepherd-button-secondary',
        },
        {
          text: 'Next →',
          action: shepherdTour.next,
          classes: 'shepherd-button-primary',
        },
      ],
    })

    // Step 4: Mode Selector
    shepherdTour.addStep({
      id: 'modes',
      title: '<span class="tour-step-badge">3</span> Choose How to Learn',
      text: `
        <p>Switch between different <strong>learning modes</strong>:</p>
        <ul style="margin-top: 8px; padding-left: 20px; color: #94a3b8;">
          <li><strong>Learn</strong> — Deep explanations</li>
          <li><strong>Quiz</strong> — Test yourself</li>
          <li><strong>Flashcards</strong> — Quick recall</li>
          <li><strong>Case Study</strong> — Clinical scenarios</li>
        </ul>
      `,
      attachTo: {
        element: '[data-tour="mode-selector"]',
        on: 'bottom',
      },
      buttons: [
        {
          text: '← Back',
          action: shepherdTour.back,
          classes: 'shepherd-button-secondary',
        },
        {
          text: 'Next →',
          action: shepherdTour.next,
          classes: 'shepherd-button-primary',
        },
      ],
    })

    // Step 5: Chat Area
    shepherdTour.addStep({
      id: 'chat',
      title: '<span class="tour-step-badge">4</span> Ask Me Anything',
      text: `
        <p>This is where the magic happens! 🪄</p>
        <p style="margin-top: 12px;">Ask questions like:</p>
        <ul style="margin-top: 8px; padding-left: 20px; color: #94a3b8;">
          <li>"Explain the brachial plexus"</li>
          <li>"Give me a mnemonic"</li>
          <li>"What are the clinical correlations?"</li>
        </ul>
        <p style="margin-top: 12px; color: #f59e0b;">Demo limit: 5 questions</p>
      `,
      attachTo: {
        element: '[data-tour="chat-area"]',
        on: 'left',
      },
      buttons: [
        {
          text: '← Back',
          action: shepherdTour.back,
          classes: 'shepherd-button-secondary',
        },
        {
          text: 'Next →',
          action: shepherdTour.next,
          classes: 'shepherd-button-primary',
        },
      ],
    })

    // Step 6: Input
    shepherdTour.addStep({
      id: 'input',
      title: '<span class="tour-step-badge">5</span> Type Your Question',
      text: `
        <p>Type your question here and press <strong>Enter</strong> or click <strong>Send</strong>.</p>
        <p style="margin-top: 12px;">I'll respond with detailed explanations, mnemonics, and clinical pearls!</p>
      `,
      attachTo: {
        element: '[data-tour="chat-input"]',
        on: 'top',
      },
      buttons: [
        {
          text: '← Back',
          action: shepherdTour.back,
          classes: 'shepherd-button-secondary',
        },
        {
          text: 'Next →',
          action: shepherdTour.next,
          classes: 'shepherd-button-primary',
        },
      ],
    })

    // Step 7: Complete
    shepherdTour.addStep({
      id: 'complete',
      title: '<span class="tour-emoji">🎉</span> You\'re Ready!',
      text: `
        <p>That's it! You now know everything to get started.</p>
        <p style="margin-top: 12px;"><strong>Pro tip:</strong> Try asking about "Brachial Plexus" — I have detailed content ready for that topic!</p>
        <p style="margin-top: 12px; color: #06b6d4;">Happy learning! 🚀</p>
      `,
      buttons: [
        {
          text: 'Start Learning →',
          action: () => {
            shepherdTour.complete()
            onComplete?.()
          },
          classes: 'shepherd-button-primary',
        },
      ],
    })

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTour(shepherdTour)

    // Auto-start tour after a brief delay
    const timer = setTimeout(() => {
      shepherdTour.start()
    }, 500)

    return () => {
      clearTimeout(timer)
      shepherdTour.cancel()
      styleSheet.remove()
    }
  }, [onComplete, onSkip])

  return null // This component doesn't render anything visible
}

export function useDemoTour() {
  const [showTour, setShowTour] = useState(false)
  const [hasSeenTour, setHasSeenTour] = useState(false)

  useEffect(() => {
    // Check if user has seen the tour before
    const seen = localStorage.getItem('atom-demo-tour-seen')
    if (!seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowTour(true)
    } else {
      setHasSeenTour(true)
    }
  }, [])

  const completeTour = () => {
    localStorage.setItem('atom-demo-tour-seen', 'true')
    setShowTour(false)
    setHasSeenTour(true)
  }

  const skipTour = () => {
    localStorage.setItem('atom-demo-tour-seen', 'true')
    setShowTour(false)
    setHasSeenTour(true)
  }

  const restartTour = () => {
    setShowTour(true)
  }

  return { showTour, hasSeenTour, completeTour, skipTour, restartTour }
}
