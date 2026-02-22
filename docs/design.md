# Talentra — Design System

## Philosophy
Neo-brutalist grid aesthetic. Boxy, structured, zero decorative softness.

Rules:
- **No rounded corners** on containers, cards, inputs, or buttons. `rounded-none` everywhere except avatars and status badges (`rounded-full`).
- **Borders over shadows.** Use `border` to define surfaces. No `shadow-*` on cards or panels.
- **Grid is visible.** Layouts use explicit column grids. Gutters and alignment are deliberate.
- **Color is accent, not fill.** Primary color appears on interactive elements and accent borders. Backgrounds stay neutral.
- **Data density.** Tables and lists are compact. Padding is tight and consistent.

## Color Tokens

All colors are defined as CSS variables in `globals.css` and mapped via Tailwind's `@layer base`. Use shadcn semantic class names throughout — never raw Tailwind color scales.

### Semantic tokens (use these in code)
```
bg-background          Page/app background
bg-card                Card and surface background
bg-muted               Subtle backgrounds (table headers, sidebar)
bg-primary             Accent / CTA (emerald)
bg-primary/10          Accent subtle fill

text-foreground        Primary text
text-muted-foreground  Secondary / helper text
text-primary           Accent text (links, active nav)

border                 Default border color
border-primary         Accent border
ring                   Focus ring

bg-destructive         Danger actions
text-destructive       Danger text
```

### Status badge colors
Status badges are the only place raw color scales are acceptable, since they carry semantic meaning and can't be expressed with shadcn tokens.

```
APPLIED    bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300
SCREENING  bg-blue-100  text-blue-700  dark:bg-blue-950  dark:text-blue-300
INTERVIEW  bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300
OFFER      bg-amber-100 text-amber-700 dark:bg-amber-950  dark:text-amber-300
HIRED      bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300
REJECTED   bg-red-100   text-red-700   dark:bg-red-950   dark:text-red-300

Job status:
OPEN       bg-emerald-100 text-emerald-700
DRAFT      bg-slate-100   text-slate-600
CLOSED     bg-red-100     text-red-600
```

### globals.css (actual values)
```
Light  --primary: oklch(0.696 0.17 162.48)     /* emerald-500 */
       --ring:    oklch(0.696 0.17 162.48)
       --sidebar-primary: oklch(0.696 0.17 162.48)

Dark   --primary: oklch(0.845 0.143 165)      /* emerald-300 */
       --primary-foreground: oklch(0.145 0 0) /* dark text for contrast */
       --ring:    oklch(0.845 0.143 165)
       --sidebar-primary: oklch(0.696 0.191 149.7) /* emerald-500 */
```

## Typography

Font: **Inter** via `next/font/google`, applied to `<body>`.

```
Page title      text-2xl font-bold tracking-tight     text-foreground
Section heading text-lg   font-semibold                text-foreground
Table header    text-xs   font-medium uppercase tracking-wide text-muted-foreground
Body            text-sm   font-normal                  text-foreground
Muted           text-xs   font-normal                  text-muted-foreground
Label           text-xs   font-medium uppercase tracking-wide text-muted-foreground
Mono            font-mono text-sm                      text-foreground
```

## Spacing

Base unit: `4px`. Page content padding: `px-6`.

```
xs   p-1   4px
sm   p-2   8px
md   p-3   12px
lg   p-4   16px
xl   p-6   24px
```

Grid gaps: `gap-4` for stat grids, `gap-6` for page-level layouts.

## Layout

### App Shell
```
┌─────────────────────────────────────────────┐
│  Sidebar (240px fixed)   │  Main (flex-1)   │
│  border-r                │                  │
│  bg-card                 │  Header (48px)   │
│                          │  border-b        │
│  Logo                    │  ─────────────   │
│  ──────────              │  Page content    │
│  Nav items               │  px-6 py-6       │
└─────────────────────────────────────────────┘
```

Sidebar: `w-60 border-r bg-card`
Main: `flex-1 flex flex-col min-h-screen`
Header: `h-12 border-b px-6 flex items-center justify-between`

### Grid presets
```
Dashboard stats:   grid grid-cols-4 gap-4
Two-column:        grid grid-cols-[1fr_320px] gap-6
Kanban board:      flex gap-4 overflow-x-auto   (each column: w-72 flex-shrink-0)
Full-width list:   w-full (table layout)
```

## Components

### Card
```
border bg-card p-4
```
No `rounded-*`. No `shadow-*`.

Featured variant (e.g. highlighted job): add left accent border:
```
border-l-4 border-l-primary
```

### Button
Defer to shadcn `<Button>` variants. Key override in `globals.css`: `--radius: 0`.

```
Default (primary):   bg-primary text-primary-foreground hover:bg-primary/90
Secondary:           bg-secondary text-secondary-foreground hover:bg-secondary/80
Outline:             border bg-background hover:bg-accent
Ghost:               hover:bg-accent hover:text-accent-foreground
Destructive:         bg-destructive text-destructive-foreground
```

Size: use `size="sm"` (`h-8 px-3 text-xs`) as default in tables and toolbars.

### Input / Select
Defer to shadcn `<Input>`, `<Select>`. Override removes rounding via `--radius: 0`.

Focus state: `focus-visible:ring-1 focus-visible:ring-primary`

### Badge
```
inline-flex items-center px-2 py-0.5 text-xs font-medium
border rounded-full        ← exception: badges use rounded-full
```
Use status colors defined in the status section above.

### Table
```
Header row:  bg-muted border-b
             text-xs font-medium uppercase tracking-wide text-muted-foreground
             px-4 py-2

Body row:    border-b hover:bg-muted/50
             text-sm text-foreground
             px-4 py-3
```

### Sidebar Nav Item
```
Default:  flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground
          hover:bg-accent hover:text-accent-foreground

Active:   flex items-center gap-2 px-3 py-2 text-sm text-primary font-medium
          bg-primary/10 border-r-2 border-r-primary
```

### Stat Card
```
border bg-card p-4 flex flex-col gap-1

Label:  text-xs font-medium uppercase tracking-wide text-muted-foreground
Value:  text-2xl font-bold text-foreground
Delta:  text-xs text-muted-foreground
```
Highlighted stat: add `border-t-2 border-t-primary`.

### Kanban Column
```
w-72 flex-shrink-0 border bg-muted flex flex-col

Header:  px-3 py-2 border-b bg-card
         flex items-center justify-between
         text-xs font-semibold uppercase tracking-wide text-muted-foreground

Body:    p-2 flex flex-col gap-2 flex-1 overflow-y-auto
```

### Kanban Card
```
border bg-card p-3 cursor-grab
hover:border-primary transition-colors

Dragging: ring-2 ring-primary border-primary
```

## Dark Mode

Toggle stored in `localStorage`. Apply `dark` class to `<html>` via a script before hydration to prevent flash.

shadcn handles dark mode via `dark:` variants on CSS variables — no manual dark overrides needed in component code as long as semantic tokens are used.

## Do / Don't

| Do | Don't ||
| `border bg-card` on all surfaces | `rounded-lg` / `shadow-md` on cards |
| Semantic tokens (`bg-muted`, `text-foreground`) | Raw color scales (`bg-slate-100`, `text-gray-500`) |
| `uppercase tracking-wide text-xs` for labels | Title-case muted labels |
| Tight padding (`p-3`, `p-4`) | Generous inner padding (`p-8`, `p-10`) |
| Accent borders on featured items (`border-l-4 border-l-primary`) | Colored section backgrounds |
| Status badge raw colors (intentional exception) | Any other raw color scale usage |
