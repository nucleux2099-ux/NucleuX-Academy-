# ATOM Landing Page & Interactive Demo - Implementation Plan

**Created:** 2026-02-09
**Status:** In Progress
**Priority:** High

---

## 🎯 Objective

Create an engaging landing page that showcases ATOM's capabilities with an interactive demo experience, helping students understand the platform's value before signing up.

---

## 📋 Phases Overview

| Phase | Focus | Timeline | Status |
|-------|-------|----------|--------|
| **Phase 1** | Static Landing Page | Week 1 | 🟡 Starting |
| **Phase 2** | Interactive Demo Sandbox | Week 2 | ⚪ Pending |
| **Phase 3** | Guided Pop-up Tutorial | Week 3 | ⚪ Pending |
| **Phase 4** | Video Walkthroughs | Week 4 | ⚪ Pending |

---

## 🚀 Phase 1: Static Landing Page (CURRENT)

### Components to Build

#### 1. Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           🧬 ATOM - Atomic Teaching & Optimization Model    │
│                                                             │
│              "Learn Medicine Like Never Before"             │
│                                                             │
│    Transform complex medical concepts into atomic units     │
│         of understanding with AI-powered learning           │
│                                                             │
│         [🎮 Try Demo]        [🚀 Get Started]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Feature Cards (4 Main Features)

| Card | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | 📚 | **Smart Libraries** | Switch between Anatomy, Physiology, Surgery, and 20+ medical subjects instantly |
| 2 | 🎯 | **Adaptive Modes** | Learn, Quiz, Flashcard, Deep Dive, Case Study - choose how you learn |
| 3 | 📎 | **Universal Attachments** | Upload PDFs, Excel, PPT, Images, JSON - ATOM understands them all |
| 4 | 💬 | **AI Conversations** | Ask anything, get Socratic teaching that builds real understanding |

#### 3. How It Works Section
```
Step 1: Choose Your Subject    →  [Library Selector Visual]
Step 2: Pick Your Mode         →  [Mode Toggle Visual]  
Step 3: Attach Your Materials  →  [File Upload Visual]
Step 4: Start Learning         →  [Chat Interface Visual]
```

#### 4. Social Proof Section
- Student testimonials (placeholder for now)
- Usage stats: "1000+ topics | 50+ textbooks | ∞ possibilities"
- University/institution logos (future)

#### 5. CTA Section
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Ready to Transform Your Learning?              │
│                                                             │
│    [🎮 Interactive Demo]    [📧 Join Waitlist]             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 6. Footer
- About ATOM / NucleuX Academy
- Contact / Support
- Privacy Policy / Terms
- Social Links

### File Structure
```
src/app/(marketing)/
├── page.tsx              # Landing page
├── layout.tsx            # Marketing layout (no sidebar)
└── components/
    ├── Hero.tsx
    ├── FeatureCards.tsx
    ├── HowItWorks.tsx
    ├── SocialProof.tsx
    ├── CTASection.tsx
    └── Footer.tsx
```

### Design Tokens
- **Primary Color:** Deep Blue (#1E3A8A) - Trust, Intelligence
- **Accent Color:** Cyan (#06B6D4) - Innovation, Energy
- **Background:** Dark gradient (matches current theme)
- **Typography:** Inter/Geist for modern feel

### Animations (Framer Motion)
- Hero text fade-in with stagger
- Feature cards slide-up on scroll
- Floating elements for visual interest
- Smooth scroll between sections

---

## 🎮 Phase 2: Interactive Demo Sandbox

### Demo Features (No Auth Required)

| Feature | Demo Behavior |
|---------|---------------|
| **Library Switching** | Pre-loaded with 3 sample subjects (Anatomy, Physiology, Biochemistry) |
| **Mode Toggle** | All modes available with sample content |
| **File Upload** | Mock upload with pre-loaded sample files |
| **AI Chat** | Limited to 5 demo questions, pre-seeded responses |

### Sandbox Architecture
```
/demo
├── DemoProvider.tsx      # Demo state management
├── DemoChat.tsx          # Limited AI interaction
├── DemoLibrary.tsx       # Sample library selector
├── DemoUpload.tsx        # Mock file handling
└── DemoProgress.tsx      # Sample progress display
```

### Sample Content
- 3 pre-loaded topics per subject
- 5 sample questions with AI responses
- Mock PDF/image attachments
- Progress visualization

---

## 📍 Phase 3: Guided Pop-up Tutorial

### Tour Library
**Recommended:** Shepherd.js (lightweight, customizable)

### Tour Steps (First-time Users)

| Step | Target | Content |
|------|--------|---------|
| 1 | Library selector | "👋 Welcome! Start by choosing your subject" |
| 2 | Mode switcher | "🎯 Pick how you want to learn today" |
| 3 | File upload | "📎 Upload your notes, textbooks, or images" |
| 4 | Chat input | "💬 Ask any question - I'll teach you step by step" |
| 5 | Progress panel | "📊 Track your mastery across all topics" |
| 6 | Settings | "⚙️ Customize your learning experience" |

### Tour Triggers
- First login (mandatory)
- "Take Tour" button in settings
- Feature-specific tours on first use

---

## 🎬 Phase 4: Video Walkthroughs

### Video Content Plan

| Video | Duration | Content |
|-------|----------|---------|
| **Overview** | 2 min | Full platform tour |
| **Libraries** | 1 min | Switching subjects, browsing topics |
| **Modes** | 1.5 min | Each mode explained with examples |
| **Attachments** | 1 min | Uploading and using different file types |
| **AI Chat** | 2 min | Sample learning conversation |
| **Progress** | 1 min | Understanding your dashboard |

### Video Placement
- Embedded in landing page
- Help center / documentation
- Onboarding email sequence
- YouTube channel (SEO)

---

## 🛠️ Technical Requirements

### Dependencies to Add
```json
{
  "framer-motion": "^11.x",
  "shepherd.js": "^12.x",
  "@heroicons/react": "^2.x",
  "react-intersection-observer": "^9.x"
}
```

### Performance Targets
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Mobile-first responsive design

---

## 📅 Phase 1 Tasks (This Week)

### Day 1-2: Setup & Hero
- [ ] Create marketing route group `(marketing)`
- [ ] Build Hero component with animations
- [ ] Implement responsive layout

### Day 3-4: Feature Cards & How It Works
- [ ] Design and build FeatureCards component
- [ ] Create HowItWorks step-by-step section
- [ ] Add scroll animations

### Day 5: Social Proof & CTA
- [ ] Build testimonial/stats section
- [ ] Create CTA with waitlist/demo buttons
- [ ] Design and implement Footer

### Day 6-7: Polish & Testing
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Deploy to preview

---

## 📝 Notes

- Landing page should work WITHOUT authentication
- Demo sandbox has limited functionality (tease, don't give everything)
- Collect emails for waitlist (future marketing)
- Track analytics on key interactions

---

## 🔗 References

- [Shepherd.js Docs](https://shepherdjs.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind UI Components](https://tailwindui.com/)

---

*Document maintained by: Narasimha & Sarath*
*Last updated: 2026-02-09*
