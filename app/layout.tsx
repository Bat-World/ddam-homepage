import type { Metadata } from "next";
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
.orbit-card{opacity:1!important;margin:0 auto;padding:4rem 0}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <LaunchIntro />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
