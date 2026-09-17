# DDAM Homepage — competition entry

My entry for the internal competition to redesign the homepage of **Dentsu Data Artist Mongol LLC** (DDAM), an AI, data and digital-marketing company in Ulaanbaatar and part of Dentsu Digital Inc.

**It didn't win.** It came close, but another entry was picked. I'm publishing it as a record of the work.

## Where I stand

I still think this was the strongest entry. That's my opinion, not the judges' decision, and I'm biased. Here's why I think so:

- **One clear idea.** The whole site is built around a single concept: DDAM as dentsu's *proving ground*. It started as the group's R&D centre in Mongolia in 2018 and became a Dentsu Digital subsidiary in 2023. Every section ties back to that idea instead of generic "we do AI" copy.
- **Nothing made up.** No fake client logos, testimonials, case studies or numbers. Every claim is one the company could stand behind in a meeting. The rules for that are written down in [`PRODUCT.md`](PRODUCT.md).
- **Real craft in the build.** It has a dot-matrix globe, a launch intro, a pinned service "orbit", scroll reveals and smooth scrolling. It still works with JavaScript off and respects `prefers-reduced-motion`.
- **A written design system.** Colours, type, spacing and rules are recorded in [`DESIGN.md`](DESIGN.md), not just scattered through the CSS.

## What's in it

- Single-page homepage: hero, services, about, history timeline, philosophy, workspace, leadership, news, careers and contact
- `/leadership`: the president's message in full
- `/news` and one published article

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, [Lenis](https://github.com/darkroomengineering/lenis) for smooth scroll and [cobe](https://github.com/shuding/cobe) for the globe. All content is static; there's no CMS or backend.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

- This is a competition entry, **not** DDAM's official website. The company name, logo, photos and leadership content belong to Dentsu Data Artist Mongol LLC and are here only to show the design in context.
- `.claude/skills/impeccable` is a vendored copy of the third-party [Impeccable](https://github.com/pbakaus/impeccable) design skill (Apache 2.0, © Paul Bakaus), which I used while building.
