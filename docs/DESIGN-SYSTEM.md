# NucleuX Academy — Design System

## 🎨 Campus Light Theme

**Vibe:** Premium university campus — warm, inviting, scholarly

---

## Color Palette

### Backgrounds
| Name | Hex | Usage |
|------|-----|-------|
| Campus White | `#FFFFFF` | Main background |
| Warm Gray | `#F8FAFC` | Secondary background, cards |
| Soft Cream | `#FAFAF9` | Alternate sections |

### Primary (Purple — Knowledge)
| Name | Hex | Usage |
|------|-----|-------|
| Royal Purple | `#7C3AED` | Primary buttons, links |
| Purple Light | `#A78BFA` | Hover states |
| Purple Pale | `#EDE9FE` | Tags, badges background |

### Accents (Campus Colors)
| Name | Hex | Usage |
|------|-----|-------|
| Forest Green | `#059669` | Success, progress |
| Warm Wood | `#B45309` | Highlights, warmth |
| Sky Blue | `#0EA5E9` | Information, links |
| Rose | `#E11D48` | Alerts, errors |
| Golden | `#CA8A04` | Achievements, rewards |

### Text
| Name | Hex | Usage |
|------|-----|-------|
| Deep Slate | `#1E293B` | Primary text |
| Gray | `#64748B` | Secondary text |
| Light Gray | `#94A3B8` | Placeholder, disabled |

### Borders & Shadows
| Name | Value | Usage |
|------|-------|-------|
| Border | `#E2E8F0` | Card borders, dividers |
| Shadow SM | `0 1px 2px rgba(0,0,0,0.05)` | Cards |
| Shadow MD | `0 4px 6px rgba(0,0,0,0.07)` | Dropdowns, modals |
| Shadow LG | `0 10px 15px rgba(0,0,0,0.1)` | Featured cards |

---

## Typography

**Font Family:** Inter (clean, modern, readable)

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 | 36px | Bold (700) | Deep Slate |
| H2 | 28px | Semibold (600) | Deep Slate |
| H3 | 22px | Semibold (600) | Deep Slate |
| Body | 16px | Regular (400) | Deep Slate |
| Small | 14px | Regular (400) | Gray |
| Caption | 12px | Medium (500) | Light Gray |

---

## Components

### Cards
```css
.campus-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.campus-card:hover {
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.1);
  border-color: #A78BFA;
}
```

### Buttons
```css
.btn-primary {
  background: #7C3AED;
  color: white;
  border-radius: 8px;
  font-weight: 500;
}

.btn-primary:hover {
  background: #6D28D9;
}

.btn-secondary {
  background: #F8FAFC;
  color: #1E293B;
  border: 1px solid #E2E8F0;
}
```

### Navigation
- Sidebar: White background with soft shadow
- Active item: Purple left border + purple text
- Hover: Light purple background (#EDE9FE)

---

## 🤖 ATOM — AI Tutor Identity

### Philosophy
ATOM embodies:
1. **Atomic Learning** — Break complex into simple, build understanding from atoms
2. **Learning Science** — Encoding > review, retrieval > recognition, desirable difficulty
3. **Advaita Subtle Blend** — Non-judgmental, witness consciousness, "the difficulty IS the learning"

### Voice & Tone
- Wise but approachable
- Questions before answers
- Celebrates struggle as growth
- Never condescending
- Subtle Sanskrit/Vedantic flavor when appropriate

### Visual Identity
- Avatar: Atomic symbol with warm glow
- Colors: Purple primary with golden wisdom accent
- Chat bubbles: Soft, rounded, inviting

---

## Campus Room Themes

| Room | Accent Color | Vibe |
|------|--------------|------|
| Welcome Center | Purple | Warm welcome |
| Library | Forest Green | Scholarly, focused |
| Exam Center | Sky Blue | Clear, precise |
| AI Tutor | Purple + Gold | Wise, guiding |
| Dashboard | Purple | Personal, tracking |
| Common Room | Warm Wood | Community, warmth |
| Arena | Golden | Achievement, competition |

---

*Design System v1.0 — February 2026*
