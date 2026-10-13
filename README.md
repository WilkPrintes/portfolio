# wilkprintes.dev

Personal portfolio of **Wilk Printes** — front-end engineer and tech lead.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4 and GSAP. The hero background is a real-time
raycasting engine written in TypeScript and rendered on a `<canvas>`, ported from my [cub3D](https://github.com/WilkPrintes/cub3d) project in C.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the development server      |
| `npm run build`        | Create a production build         |
| `npm run start`        | Serve the production build        |
| `npm run lint`         | Run ESLint                        |
| `npm run typecheck`    | Type-check with `tsc`             |
| `npm run format`       | Format the codebase with Prettier |
| `npm run format:check` | Check formatting without writing  |

## Project structure

```
src/
├── app/                    # Routes, root layout, metadata, icons and global styles
├── components/
│   ├── brand/              # Logo
│   ├── layout/             # Site header (navbar), contact dock, footer, back-to-top, <main> wrapper
│   ├── sections/           # One folder per page section (hero, about, experience, ...)
│   ├── terminal/           # Quake-style terminal: provider, panel and commands
│   └── ui/                 # Reusable primitives (Section, Card, Window, Backdrop, LogoLoop, ...)
├── config/                 # Site links/metadata, section anchors and brand/tech logos
├── hooks/                  # Shared hooks (pointer spotlight, tilt, loops while visible)
├── i18n/                   # Language provider and pt/en dictionaries
└── lib/
    ├── gsap.ts             # Plugin registration and media-query presets
    ├── raycaster/          # Raycasting engine: map, DDA, camera path and renderer
    └── utils.ts            # `cn()` and small helpers
```

UI primitives follow the compound component pattern, e.g.:

```tsx
<Section id="about">
  <Backdrop>
    <Backdrop.Dots />
    <Backdrop.Watermark>01</Backdrop.Watermark>
  </Backdrop>
  <Section.Container>
    <Section.Header index="01" title="About" subtitle="Engineering, front-end and leadership" />
    <Card featured spotlight>
      <Card.Title>Title</Card.Title>
      <Card.Description>Description</Card.Description>
    </Card>
  </Section.Container>
</Section>
```

## Content

All copy lives in `src/i18n/dictionaries` (`pt.ts` is the source of truth for the shape, `en.ts` must match it).
Links and the resume path are in `src/config/site.ts`.

## Accessibility

Every animation is skipped when the user prefers reduced motion, and decorative loops pause when off-screen.
Press <kbd>~</kbd> anywhere to open the terminal.
