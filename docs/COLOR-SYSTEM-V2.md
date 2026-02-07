# NucleuX Academy — Color System V2

**Design Philosophy:** One unified dark navy spine, with rooms as subtle accent variations.

---

## 🎨 Master Color Map

| Purpose | Color | Tailwind Class |
|---------|-------|----------------|
| **App Base** | `#0D1B2A` | `bg-base` |
| **Card Background** | `#0F2233` | `bg-card-dark` |
| **System Accent** | `#06B6D4` | `text-cyan-500` / `bg-cyan-500` |
| **Primary Text** | `#E5E7EB` | `text-gray-200` |
| **Secondary Text** | `#9CA3AF` | `text-gray-400` |
| **Borders** | `rgba(6, 182, 212, 0.15)` | `border-cyan-500/15` |

### Room Accents
| Room | Color | Tailwind |
|------|-------|----------|
| Dashboard | `#7C3AED` | `purple-500` |
| Library | `#059669` | `emerald-600` |
| Classroom | `#0EA5E9` | `sky-500` |
| Exam Center | `#0EA5E9` | `sky-500` |
| Community | `#B45309` | `amber-700` |
| Arena | `#CA8A04` | `yellow-600` |

---

## 🏗️ 3-Layer Model

### Layer 1 — Base (Same Everywhere)
```css
/* Background */
.app-base { background: #0D1B2A; }

/* Cards */
.card-dark { 
  background: #0F2233;
  border: 1px solid rgba(6, 182, 212, 0.1);
}

/* Elevated cards */
.card-elevated {
  background: #142538;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

### Layer 2 — Room Identity (Subtle Accents)
Apply room color to:
- ✅ Left border of cards (3px solid)
- ✅ Section headings (text color)
- ✅ Active tab underline
- ✅ Room label badge
- ✅ Progress bars
- ✅ Hover states (10% opacity background)

```css
/* Example: Library Room */
.room-library .card-accent { border-left: 3px solid #059669; }
.room-library .heading { color: #059669; }
.room-library .tab-active { border-bottom: 2px solid #059669; }
.room-library .progress-bar { background: #059669; }
.room-library .hover-accent:hover { background: rgba(5, 150, 105, 0.1); }
```

### Layer 3 — ATOM Presence
```css
/* ATOM Widget Shell - Always Cyan */
.atom-widget {
  background: #0D1B2A;
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
}

/* Room-specific subtle halo */
.room-library .atom-widget {
  box-shadow: 
    0 0 20px rgba(6, 182, 212, 0.2),
    0 0 40px rgba(5, 150, 105, 0.1); /* Green halo */
}

.room-arena .atom-widget {
  box-shadow: 
    0 0 20px rgba(6, 182, 212, 0.2),
    0 0 40px rgba(202, 138, 4, 0.1); /* Gold halo */
}
```

---

## 🎭 Gradient Logic

### Card Header Gradient Template
```css
/* Dark edge → Room color fade → Thin accent line */
.card-header-gradient {
  background: linear-gradient(
    90deg,
    #0D1B2A 0%,
    rgba(ROOM_COLOR, 0.15) 50%,
    rgba(ROOM_COLOR, 0.3) 100%
  );
  border-bottom: 1px solid ROOM_COLOR;
}
```

### Room-Specific Gradients
```css
/* Dashboard - Purple */
.room-dashboard .card-header {
  background: linear-gradient(90deg, #0D1B2A 0%, rgba(124, 58, 237, 0.15) 50%, rgba(124, 58, 237, 0.3) 100%);
  border-bottom: 1px solid rgba(124, 58, 237, 0.5);
}

/* Library - Green */
.room-library .card-header {
  background: linear-gradient(90deg, #0D1B2A 0%, rgba(5, 150, 105, 0.15) 50%, rgba(5, 150, 105, 0.3) 100%);
  border-bottom: 1px solid rgba(5, 150, 105, 0.5);
}

/* Classroom - Sky */
.room-classroom .card-header {
  background: linear-gradient(90deg, #0D1B2A 0%, rgba(14, 165, 233, 0.15) 50%, rgba(14, 165, 233, 0.3) 100%);
  border-bottom: 1px solid rgba(14, 165, 233, 0.5);
}

/* Community - Amber */
.room-community .card-header {
  background: linear-gradient(90deg, #0D1B2A 0%, rgba(180, 83, 9, 0.15) 50%, rgba(180, 83, 9, 0.3) 100%);
  border-bottom: 1px solid rgba(180, 83, 9, 0.5);
}

/* Arena - Gold */
.room-arena .card-header {
  background: linear-gradient(90deg, #0D1B2A 0%, rgba(202, 138, 4, 0.15) 50%, rgba(202, 138, 4, 0.3) 100%);
  border-bottom: 1px solid rgba(202, 138, 4, 0.5);
}
```

---

## 🧭 Navbar / Sidebar

### Recommended: Clean with Room Indicator
```css
.sidebar {
  background: #0D1B2A;
  border-right: 1px solid rgba(6, 182, 212, 0.1);
}

.sidebar-item {
  color: #9CA3AF;
  transition: all 0.2s;
}

.sidebar-item:hover {
  color: #E5E7EB;
  background: rgba(6, 182, 212, 0.05);
}

/* Active item - thin colored strip */
.sidebar-item.active {
  color: #E5E7EB;
  border-left: 3px solid ROOM_COLOR;
  background: rgba(ROOM_COLOR, 0.1);
}
```

---

## ⚡ Transitions

### Room Switch Animation
```css
/* Apply to all accent elements */
.room-accent {
  transition: 
    color 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.3s ease;
}
```

---

## 🎯 Button System

### Primary Button (System-wide)
```css
.btn-primary {
  background: #06B6D4;
  color: #0D1B2A;
  font-weight: 600;
}

.btn-primary:hover {
  background: #22D3EE;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
}
```

### Secondary Button (Room-specific)
```css
.btn-secondary {
  background: transparent;
  border: 1px solid ROOM_COLOR;
  color: ROOM_COLOR;
}

.btn-secondary:hover {
  background: rgba(ROOM_COLOR, 0.1);
}
```

---

## 📱 Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'base': '#0D1B2A',
        'base-light': '#0F2233',
        'base-elevated': '#142538',
        'accent': '#06B6D4',
        'accent-light': '#22D3EE',
        'room': {
          'dashboard': '#7C3AED',
          'library': '#059669',
          'classroom': '#0EA5E9',
          'exam': '#0EA5E9',
          'community': '#B45309',
          'arena': '#CA8A04',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-green': '0 0 20px rgba(5, 150, 105, 0.3)',
        'glow-sky': '0 0 20px rgba(14, 165, 233, 0.3)',
        'glow-amber': '0 0 20px rgba(180, 83, 9, 0.3)',
        'glow-gold': '0 0 20px rgba(202, 138, 4, 0.3)',
      }
    }
  }
}
```

---

## 🤖 ATOM Widget Specification

### Base State
- Shell: Navy `#0D1B2A`
- Border: Cyan at 30% opacity
- Glow: Cyan `rgba(6, 182, 212, 0.2)`

### Room-Aware State
- Primary glow: Cyan (always)
- Secondary halo: Room color at 10% opacity
- Inner accent: Room color for mode indicator

### Expanded State
- Background: `#0F2233`
- Header: Room color gradient
- Input focus: Cyan ring
- Send button: Cyan

---

*Color System V2 — Unified Dark Navy with Room Accents*
*February 2026*
