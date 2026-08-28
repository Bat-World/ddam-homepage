import type { Metadata, Viewport } from "next";
import { Archivo, Azeret_Mono } from "next/font/google";
import "./globals.css";
import LaunchIntro, { INTRO_SEEN_KEY } from "./components/launch-intro";
import SiteHeader from "./components/site-header";
import SmoothScroll from "./components/smooth-scroll";
import SiteFooter from "./components/site-footer";

const azeretMono = Azeret_Mono({
  variable: "--font-azeret-mono",
  subsets: ["latin"],
});

// Stand-in for the token file's display face, Roc Grotesk, which is a licensed
// typeface and can't be served from a registry. Archivo (OFL) is the closest
// open grotesque — same wide neo-grotesque proportions.
//
// --font-display in globals.css lists Roc Grotesk *ahead* of this, so dropping
// the licensed files in as a next/font/local face takes over automatically with
// no other edit; until then the browser falls through to Archivo.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const TITLE =
  "Dentsu Data Artist Mongol — AI, Data Engineering & Analytics in Mongolia";

const DESCRIPTION =
  "Dentsu Data Artist Mongol LLC builds AI solutions, data engineering and analytics, R&D proofs of concept and digital marketing for enterprises in Mongolia — backed by the dentsu network.";

// Resolves the origin that relative metadata URLs are composed against. Falls
// back to the deployment's own URL, so previews advertise themselves rather
// than the production domain; set NEXT_PUBLIC_SITE_URL once a domain exists.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Dentsu Data Artist Mongol",
  },
  description: DESCRIPTION,
  keywords: [
    "AI solutions Mongolia",
    "data engineering",
    "data analytics",
    "digital marketing Mongolia",
    "dentsu",
    "Dentsu Data Artist Mongol",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Dentsu Data Artist Mongol",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  applicationName: "Dentsu Data Artist Mongol",
  authors: [{ name: "Dentsu Data Artist Mongol LLC" }],
  creator: "Dentsu Data Artist Mongol LLC",
  publisher: "Dentsu Data Artist Mongol LLC",
  category: "technology",
  // The site is a single scrolling page with a mailto: as its only action, so
  // phone/address autolinking only ever adds unwanted styling on iOS.
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  colorScheme: "dark",
};

// Organisation markup for search results and the knowledge panel. Only facts
// PRODUCT.md lists as verified — no client, headcount or award claims beyond
// what the page itself already states.
const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dentsu Data Artist Mongol LLC",
  alternateName: "DDAM",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description: DESCRIPTION,
  email: "info@mn.data-artist.com",
  parentOrganization: { "@type": "Organization", name: "Dentsu Digital Inc." },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ulaanbaatar",
    addressCountry: "MN",
  },
};

// Runs before first paint so a repeat load never flashes the intro overlay.
const introSeenScript = `try{if(sessionStorage.getItem(${JSON.stringify(
  INTRO_SEEN_KEY,
)}))document.documentElement.classList.add('intro-seen')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${azeretMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSeenScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD),
          }}
        />
        {/* Two things here depend on JS and have to fail open.
            · Scroll reveals start hidden and are unhidden by an observer, so
              with no JS there is nothing to unhide them.
            · The launch intro holds on its first frame until a script starts
              it, so with no JS it would sit closed over the page for good.
            · The service orbit pins a stage and shows one practice at a time;
              with no JS it would pin on the first one for four viewports. It
              unpins into a plain stacked list instead. */}
        <noscript>
          <style>{`[data-launch-intro]{display:none}
[data-reveal]{opacity:1!important;transform:none!important}
.orbit-track{height:auto!important}
.orbit-stage{position:static;display:block;height:auto;padding:6rem 0}
.orbit-rings{display:none}
.orbit-stack{display:block}
.orbit-card{opacity:1!important;margin:0 auto;padding:4rem 0}
.year-track{height:auto!important}
.year-stage{position:static;height:auto;padding:2rem 0}
.year-rail-frame,.month-strip{display:none}
.era-stack{display:block}
.era-copy{opacity:1!important;transform:none!important;padding:1.75rem 0;border-top:1px solid rgba(17,17,17,.15)}`}</style>
        </noscript>
      </head>
      {/*
        `suppressHydrationWarning` here is about browser extensions, not about
        anything this app renders. Several of them stamp an attribute onto
        <body> before React hydrates — ColorZilla's `cz-shortcut-listen`,
        Grammarly's `data-gr-*`, and others — and React reports the difference
        as a hydration mismatch on every load for anyone who has one installed.

        The flag is one level deep: it makes React accept the DOM's attributes
        on this element only, and changes nothing about how children hydrate.
        So a real mismatch inside the page still reports normally, which is why
        it belongs on <body> and nowhere further in.
      */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SmoothScroll />
        <LaunchIntro />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
