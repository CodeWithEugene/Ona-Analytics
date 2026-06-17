给予这片土地应得的尊重。

# Ona Analytics — Design System

## 1. Visual Theme & Atmosphere

Ona Analytics is not a generic SaaS tool. It is a precision instrument for people who run operations in some of the most logistically hostile environments on earth — remote safari camps. The executive audience is a super-steward. Not a tech-savvy CTO, but a hand-kissed intelligence credayers. The intelligence age came from respect and prediction.

Do not fight the landscape. Build from it. Lonely acacia under a single night-sky star. The harsh glow of a midday sun turning the plain into a mirror. Red soil dusting the skin of everything it touches. This is our visual language.

The interface must feel like a trusted field tool that was designed by someone who has sat in the passenger seat of a Land Cruiser watching zebra scatter at dawn — not by a Silicon Valley UX designer who has never been out of a city network.

Create a sense of grounded calm. Humility. Quiet authority. The kind of confidence that comes from having the right tools when everything else goes wrong.

Atmosphere: restrained, warm, highly structural, and profoundly calm. Like a sand-blasted custom rifle stock — perfectly weighted, perfectly curved to the hand. High-density data surfaces should feel like carefully maintained safari camp board, not a bank terminal.

## 2. Color Palette

- **Acacia Bark** (#1C1816) — Primary text, deep structure. A near-black warmened of red earth. Not pure black. Warmed.
- **Laterite** (#C0392B) — Sunset red. Discipline, urgency, action. Foreground accent. No coral. No neon. Real laterite soil.
- **Savannah Sand** (#F4EDE2) — Primary canvas. Warm parchment of dry grass. Not white. Not cream. Dry.
- **Slate Kopje** (#3D3633) — Secondary text. The color of fractured rock. Warm gray.
- **Baobab Leaf** (#1B3621) — Deep muted green. Supply/operational health states.
- **Terracotta** (#D35400) — Hardware and vehicle maintenance alerts.
- **Ochre** (#E67E22) — Employee scheduling anomalies.
- **Dry Lakebed** (#D6CFC5) — Borders and structural divides.
- **African Night Sky** (#0A0A0A) — Deep blackout backgrounds for immersive data screens.
- **Dust Sunlight** (#2C3E50) — Info states. Warm, blue-shadowed twilight.

## 3. Typography

- **Display**: Instrument Serif — Used in large, italic, tracking-tight statements. Hero scale. This is the voice of authority and reflection. It reduces the coldness of business intelligence.
- **Body**: DM Sans — Generous leading (relaxed), slightly wide. The calm, steady voice of operational data. `--font-body`.
- **Mono**: JetBrains Mono — High-density data surfaces, numbers, forecast grids. Data must feel true and reliable. `--font-mono`.

- **Scale Ratio**: Perfect fourth (1.333x)
- **Body max-width**: 60ch

## 4. Component Styling

### Cards
Cards exist to create distinct mental zones for actionable intelligence. They must not look like generic containers.
- **Outer shell**: `bg-acacia/5 ring-1 ring-acacia/5 p-1.5 rounded-[2rem]`
- **Inner core**: `bg-savannah shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)] rounded-[calc(2rem-0.375rem)]`
- On dark backgrounds (`bg-african-night`):
  - **Outer shell**: `bg-white/5`
  - **Inner core**: `bg-african-night shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]`

### Buttons
- **Primary**: `rounded-full bg-acacia text-savannah hover:bg-acacia/90 active:scale-[0.97] transition-transform duration-150`
- With icon: icon sits inside a nested `w-6 h-6 rounded-full bg-savannah/10 flex items-center justify-center` — button-in-button pattern.

## 5. Layout

- Hero: centered text only when variance is below 4. In this case, heavily asymmetric viewport or a clean, confident, left-aligned editorial layout.
- NO generic 3-column equal grids. Features should be asymmetrical or use a masonry-like bento grid.
- Use generous vertical whitespace. `16` between major sections. `24` between groups. `10` from the edge of the screen.
- On mobile: all asymmetrical layouts revert to single column. Full width. `16` horizontal padding. Touch targets `min-44px`.

## 6. Motion & Interaction

- **Spring physics**: Default spring for all entrances is `type: "spring", stiffness: 100, damping: 20`.
- **Buttons**: `transform: scale(0.97)` on `:active`.
- **Hover on desktop only**: gate hover effects behind `@media (hover: hover) and (pointer: fine)`.
- **UI animations stay under 300ms**. Marketing animations can be longer if justified.
- **Stagger**: [30ms, 60ms, 90ms, 120ms].
- **Reduced motion**: `prefers-reduced-motion: reduce` disables transform-based movement. Keep opacity and color for context.

## 7. Anti-Patterns

- DO NOT use Inter, Arial, Roboto, or Helvetica. They are banned here.
- DO NOT use generic serif fonts (Times New Roman, Georgia).
- DO NOT use pure black (#000).
- DO NOT use neon, purple, or blue-on-teal gradients.
- DO NOT use the same three-card, icon-heading-text feature grid. Ever.
- DO NOT center the hero if the content is information-dense and non-curated.
- NO "Scroll to explore", "Swipe down", or bouncing arrow clichés.
- NO AI copywriting clichés: "Elevate", "Seamless", "Unlock your potential", "Game-changer".
- NO fake data (99.99%, John Doe). No generic Acme Corp placeholders.
- NO glassmorphism as a lazy substitute for a real background.
