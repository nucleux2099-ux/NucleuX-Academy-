# NucleuX Academy Design System
## ATOM Matte Theme

Inspired by **ATOM Clinics** branding — premium, scientific, and warm.

---

## 🎨 Color Palette

### Primary Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Teal** | `#5BB3B3` | `--primary` | Primary actions, links, highlights |
| **Gold** | `#C9A86C` | `--accent` | Premium features, accents, awards |
| **Sage** | `#7BA69E` | `--chart-3` | Secondary actions, library |

### Background Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Deep Slate** | `#2D3E50` | `--background` | Main background |
| **Slate Light** | `#364A5E` | `--card` | Cards, elevated surfaces |
| **Slate Dark** | `#253545` | `--sidebar` | Sidebar, footers |
| **Elevated** | `#3A4D5F` | `--muted` | Input fields, secondary surfaces |

### Text Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Cream** | `#E8E0D5` | `--foreground` | Primary text |
| **Muted** | `#A0B0BC` | `--muted-foreground` | Secondary text, labels |
| **Dark** | `#1E2D3D` | `--primary-foreground` | Text on primary buttons |

### Semantic Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Destructive** | `#E57373` | `--destructive` | Errors, delete actions |
| **Success** | `#7BA69E` | - | Success states |
| **Warning** | `#C9A86C` | - | Warnings |

---

## 🖼️ Visual Style

### Matte Finish
- No glossy gradients
- Soft shadows without glow
- Subtle borders (8% opacity)
- Noise texture overlay (optional)

### Shadows

```css
.shadow-matte     /* 0 4px 20px rgba(0, 0, 0, 0.25) */
.shadow-matte-md  /* 0 8px 30px rgba(0, 0, 0, 0.3) */
.shadow-matte-lg  /* 0 12px 40px rgba(0, 0, 0, 0.35) */
```

### Borders

```css
border-[rgba(232,224,213,0.08)]  /* Standard border */
border-[rgba(232,224,213,0.12)]  /* Emphasized border */
border-teal-subtle               /* Teal accent border */
border-gold-subtle               /* Gold accent border */
```

---

## 🧱 Components

### Cards

```tsx
<div className="matte-card p-6">
  {/* Content */}
</div>

// Or using component
<Card className="matte-card">
  <CardContent>...</CardContent>
</Card>
```

### Buttons

```tsx
// Primary (Teal)
<Button variant="default">Action</Button>

// Gold accent (Premium)
<Button className="bg-[#C9A86C] text-[#1E2D3D] hover:bg-[#B89A5E]">
  Premium
</Button>

// Ghost
<Button variant="ghost">Cancel</Button>
```

### Inputs

```tsx
<Input className="matte-input" placeholder="Search..." />
```

### Metallic Text (for branding)

```tsx
<h1 className="text-metallic-teal">NucleuX Academy</h1>
<span className="text-metallic-gold">Premium</span>
```

---

## 🎭 Room Colors

Each section has a distinct accent color:

| Room | Color | Hex |
|------|-------|-----|
| Dashboard | Teal | `#5BB3B3` |
| Library | Sage | `#7BA69E` |
| Classroom | Sky Teal | `#6BA8C9` |
| Exam Center | Teal | `#5BB3B3` |
| Community | Gold | `#C9A86C` |
| Arena | Bright Gold | `#D4AF37` |
| ATOM | Teal | `#5BB3B3` |

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small devices |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop (sidebar shows) |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

---

## ✨ Animations

### Standard Transitions

```css
.room-transition {
  transition: border-color 0.25s ease, 
              background-color 0.25s ease, 
              box-shadow 0.3s ease;
}
```

### Card Hover

```tsx
<div className="card-hover">
  {/* Lifts and shows teal border on hover */}
</div>

<div className="card-hover-gold">
  {/* Premium card - gold border on hover */}
</div>
```

### Entrance Animations

```css
.animate-fade-in      /* Fade + slide up */
.animate-slide-in-up  /* Slide from bottom */
.animate-float        /* Gentle floating */
.animate-pulse-teal   /* Subtle teal pulse */
.animate-glow-gold    /* Gold glow pulse */
```

---

## 🖋️ Typography

### Font Stack

```css
--font-sans: 'Geist Sans', system-ui, sans-serif;
--font-mono: 'Geist Mono', monospace;
```

### Hierarchy

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 | 2rem | Bold | Cream |
| H2 | 1.5rem | Semibold | Cream |
| H3 | 1.25rem | Semibold | Cream |
| Body | 1rem | Normal | Cream |
| Small | 0.875rem | Normal | Muted |
| Caption | 0.75rem | Medium | Muted |

---

## 🎯 Usage Examples

### Dashboard Card

```tsx
<div className="matte-card p-6 card-hover">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-xl bg-[#5BB3B3]/15 flex items-center justify-center">
      <BookOpen className="w-5 h-5 text-[#5BB3B3]" />
    </div>
    <div>
      <h3 className="font-semibold text-[#E8E0D5]">Library</h3>
      <p className="text-sm text-[#A0B0BC]">Browse topics</p>
    </div>
  </div>
</div>
```

### Premium Badge

```tsx
<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#C9A86C]/15 text-[#C9A86C] border border-[#C9A86C]/20">
  Premium
</span>
```

### ATOM Badge

```tsx
<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#5BB3B3] text-[#1E2D3D]">
  AI
</span>
```

---

## 📁 File Structure

```
src/
├── app/
│   └── globals.css        # Theme variables & utilities
├── components/
│   ├── ui/                # shadcn components
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── Header.tsx         # Top header
│   ├── BottomNav.tsx      # Mobile navigation
│   └── ...
└── docs/
    └── DESIGN-SYSTEM.md   # This file
```

---

## 🔄 Migration from Old Theme

Replace these color values:

| Old (Navy/Cyan) | New (Slate/Teal) |
|-----------------|------------------|
| `#0D1B2A` | `#2D3E50` |
| `#0F2233` | `#364A5E` |
| `#06B6D4` | `#5BB3B3` |
| `#7C3AED` | `#5BB3B3` or `#C9A86C` |
| `#E5E7EB` | `#E8E0D5` |
| `#9CA3AF` | `#A0B0BC` |

---

*Design System v2.0 — ATOM Matte Theme*
*Updated: 2026-02-08*
