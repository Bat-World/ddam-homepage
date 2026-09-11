# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: enterprise decision-makers in Mongolia — banks, telco, retail, government and other large organisations — evaluating whether Dentsu Data Artist Mongol can deliver an AI, data engineering or analytics project. They typically arrive from a referral, a dentsu network introduction, or search, and are vetting credibility before making contact. Their job on this site is to decide whether this team is competent, real, and worth an email.

Secondary (confirmed, served by the careers section): Mongolian data, AI, engineering, strategy and design talent deciding whether to apply.

## Product Purpose

Dentsu Data Artist Mongol LLC is a Mongolian AI, data and digital-marketing consultancy operating as a subsidiary of Dentsu Digital Inc. within the dentsu group. The homepage exists to establish credibility with enterprise buyers and open a conversation. Success is a qualified new-business enquiry to `ddam@group.data-artist.com`.

## Core Concept

**DDAM is a proving ground.** The company was dentsu's R&D centre in Mongolia from 2018 — the group's own experiment before it was anyone's partner — and became a subsidiary of Dentsu Digital in 2023. One frame, three levels, all of them already on the record:

- **Origin** — the standard arrived before the market did. Most companies this young grow outward from local clients and earn an enterprise standard afterwards; this one inherited it first.
- **Service** — the Proof of Concept practice sells the ability to reach an honest *no*, cheaply, before a client spends a year building.
- **People** — ~150 today, tripled in three years, working slightly ahead of what they have done before under expert review. The energy is not "we are young"; it is that the company was built to test things and so has no inherited ceiling.

This is the answer to the three questions the site has to survive: where the energy comes from, why a client should trust DDAM specifically, and what separates it from another young AI company. Copy that cannot be traced back to one of the three levels is generic and should be cut.

Framing risk to hold: "we were dentsu's R&D centre" can also be heard as *offshore back office*. Every statement of the origin must carry the standard with it — held to Japanese enterprise practice, not doing someone else's overflow.

## Positioning

Enterprise-grade methods proven across the global dentsu network, delivered locally by a team based in Ulaanbaatar and adapted to the data, languages and regulations that actually apply in Mongolia. The stated working stance: scope against a decision the business already makes, engineer the data that feeds it, and stay on after launch to prove the number moved. A local agency cannot truthfully claim the network backbone; a foreign consultancy cannot truthfully claim the local adaptation.

## Operating Context

Four practices run by one delivery team:

- AI Solution Development — use-case discovery through model in production; forecasting, personalisation, document intelligence, conversational systems.
- Data Engineering & Analytics — pipelines, warehouses, governance, then dashboards and measurement.
- Proof of Concept & R&D — short funded experiments producing a working prototype, an honest cost model, and a go/no-go.
- Digital Marketing — performance, brand and CRM run on the same data spine.

Buyers evaluate on a desktop during a working day, often after an internal referral. The homepage is a single scrolling page with anchor navigation (`#services`, `#about`, `#leadership`, `#careers`, `#contact`). Two routes sit outside it, each because its content is longer than a band can hold: `/news/…` for a published article, and `/leadership` for the president's message in full. Both are summarised by a homepage band that links to them; neither is reachable any other way.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript. Lenis for smooth scroll.
- Content is static and authored in-component; there is no CMS.
- Site is a marketing surface only — no authenticated area, no forms. The single conversion action is a `mailto:` link.
- `NEXT_PUBLIC_SITE_URL` is unset; metadata falls back to the deployment URL. A production domain is an open decision.
- The "Open roles" link in the careers section currently points at `#careers` — there is no roles listing yet. Undecided whether one will exist.
- English only. No Mongolian-language version is planned; no i18n plumbing is required.

## Brand Commitments

- Legal entity name **Dentsu Data Artist Mongol LLC**; parent **Dentsu Digital Inc.**; network **dentsu group**. These names, their casing, and the logo lockup must stay factually correct.
- No formal dentsu brand guideline is enforced on this site. Palette, typography, motion and layout are the project's own and may evolve freely.
- Roc Grotesk is referenced first in `--font-display` as an aspirational licensed face, with Archivo (OFL) as the shipped stand-in. This is a convenience hook, **not** a binding brand requirement.
- Contact: `ddam@group.data-artist.com`, (+976) 77 11 33 26. Office: Altan Joloo Tower 6F, Seoul street, 5th khoroolol, 3rd khoroo, Sukhbaatar district, Ulaanbaatar Mongolia, 14252.

## Evidence on Hand

Real, verified facts safe to use:

- 160+ specialists across AI, data and marketing.
- The only Dentsu Digital subsidiary in Mongolia.
- Four practices under one delivery team.
- Headquarters in Ulaanbaatar; parent Dentsu Digital Inc.; dentsu group network.
- The management team, supplied by the company with the official portrait set: Hatsumi Imai (今井初実), President and Executive Officer; Makito Tsukahara (塚原牧人), Vice President and Executive Officer; Khandmaa Batbayar (Б.Хандмаа), Digital Marketing Division, Executive Officer; Yoshiki Miyamoto (宮本良樹), Corporate Planning and Administration Division, Executive Officer. Held in `app/components/leadership.ts`.
- The president's message, supplied as her own text and printed at `/leadership` with two orthographic edits recorded in that file. Nothing in it may be paraphrased into a claim elsewhere on the site — the ambition to be the group's AI development hub is hers to state in a signed letter, not a fact the page can assert on its own.

Absent — must not be fabricated: client names, logos, case studies, testimonials, revenue or performance benchmarks, awards, press coverage, pricing, named open roles, and any team member beyond the four listed above. The news section and any proof block must not invent these.

## Product Principles

1. **Credibility before persuasion.** The buyer is vetting, not browsing. Every claim on the page must be one the company can defend in a meeting.
2. **Local delivery, global backbone.** Both halves of the position appear together; either alone misrepresents the company.
3. **Decisions, not models.** Work is framed by the business decision it changes, never by technology for its own sake.
4. **One action.** The page funnels to a single conversation-starting email; competing calls to action dilute it.
5. **No invented proof.** Where evidence is absent, the design carries weight through craft and specificity rather than placeholder logos or fictional testimonials.

## Accessibility & Inclusion

No formal standard was mandated. Product-specific requirement established by the existing implementation: the page must remain fully usable with JavaScript disabled and must honour `prefers-reduced-motion` — the scroll-reveal system, the launch intro overlay and the pinned service orbit all already have opt-out paths that future work must preserve.
