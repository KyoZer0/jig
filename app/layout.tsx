import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F59E0B" },
    { media: "(prefers-color-scheme: dark)", color: "#D97706" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "JigSolitaire — Free Online Jigsaw Puzzle Game | Play 77+ Puzzles",
    template: "%s | JigSolitaire",
  },
  description: "Play free jigsaw puzzles online! 77+ stunning HD puzzles, daily challenges, streak tracking & relaxing music. No download needed — works on mobile, tablet & desktop. Start your puzzle journey today!",
  keywords: [
    // Primary keywords
    "jigsaw puzzle online",
    "free puzzle game",
    "online jigsaw",
    "puzzle game free",
    // Game-specific
    "jigsaw solitaire",
    "sliding puzzle",
    "tile puzzle game",
    "picture puzzle",
    // User intent
    "play puzzles online",
    "free games no download",
    "unblocked puzzle games",
    "browser puzzle game",
    // Device targeting
    "mobile puzzle game",
    "tablet puzzle",
    "touch puzzle game",
    // Experience
    "relaxing puzzle game",
    "brain training games",
    "casual puzzle",
    "daily puzzle challenge",
    // Categories
    "nature puzzles",
    "landscape puzzles", 
    "animal puzzles",
    "travel puzzles",
    "art puzzles",
  ],
  authors: [{ name: "JigSolitaire Team", url: "https://jigsolitaire.online" }],
  creator: "JigSolitaire",
  publisher: "JigSolitaire",
  applicationName: "JigSolitaire",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jigsolitaire.online"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "JigSolitaire — Free Online Jigsaw Puzzle Game",
    description: "Play 77+ stunning HD jigsaw puzzles for free! Daily challenges, streak tracking, relaxing music. No download — works on all devices. Start playing now!",
    url: "https://jigsolitaire.online",
    siteName: "JigSolitaire",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "JigSolitaire - Free Online Jigsaw Puzzle Game with 77+ Puzzles",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JigSolitaire — Free Jigsaw Puzzles Online 🧩",
    description: "77+ HD puzzles, daily challenges, streak tracking & relaxing music. Play free on any device — no download!",
    images: ["/og-image.svg"],
    creator: "@jigsolitaire",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "games",
  classification: "Puzzle Game",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "JigSolitaire",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#F59E0B",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "JigSolitaire",
    "alternateName": ["Jigsaw Solitaire", "JigSolitaire Online", "Free Jigsaw Puzzle Game"],
    "description": "Play 77+ stunning HD jigsaw puzzles for free! Daily challenges, streak tracking, relaxing background music, and smooth drag-and-drop gameplay. No download required — works on all devices.",
    "url": "https://jigsolitaire.online",
    "image": "https://jigsolitaire.online/og-image.svg",
    "applicationCategory": "Game",
    "applicationSubCategory": "Puzzle Game",
    "gamePlatform": ["Web Browser", "Mobile Browser", "iOS Safari", "Android Chrome", "Desktop Chrome", "Desktop Firefox", "Desktop Safari", "Desktop Edge"],
    "operatingSystem": ["iOS 12+", "Android 8+", "Windows 10+", "macOS 10.15+", "Linux", "ChromeOS"],
    "browserRequirements": "Requires JavaScript enabled",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "gameFeature": [
      "77+ high-definition puzzle images",
      "Daily streak tracking & achievements",
      "Relaxing background music player",
      "Animated track transitions",
      "Drag-and-drop touch controls",
      "Keyboard shortcuts support",
      "Auto-save game progress",
      "Multiple grid sizes (3x3, 4x4, 5x5)",
      "Hint system for stuck moments",
      "Confetti celebration animations",
      "Mobile, tablet, and desktop optimized",
      "No account required",
      "Instant play — no download"
    ],
    "genre": ["Puzzle", "Jigsaw", "Solitaire", "Brain Training", "Casual", "Relaxing"],
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "playMode": "SinglePlayer",
    "numberOfPlayers": {
      "@type": "QuantitativeValue",
      "minValue": 1,
      "maxValue": 1
    },
    "author": {
      "@type": "Organization",
      "name": "JigSolitaire",
      "url": "https://jigsolitaire.online"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JigSolitaire",
      "url": "https://jigsolitaire.online"
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JigSolitaire",
    "alternateName": "Jigsaw Solitaire Online",
    "url": "https://jigsolitaire.online",
    "description": "Free online jigsaw puzzle game with 77+ HD puzzles, daily challenges, and relaxing gameplay.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://jigsolitaire.online/levels?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://jigsolitaire.online"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Play Game",
        "item": "https://jigsolitaire.online/game"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Puzzle Collections",
        "item": "https://jigsolitaire.online/levels"
      }
    ]
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does JigSolitaire save my progress?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Your puzzle states and unlocked themes are saved automatically in your browser profile."
        }
      },
      {
        "@type": "Question",
        "name": "Is the game free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. JigSolitaire is a free-to-play online puzzle game, with optional premium theme packs arriving soon."
        }
      },
      {
        "@type": "Question",
        "name": "Is it unblocked at school/work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. JigSolitaire runs directly in your browser and is commonly accessible as an unblocked puzzle game on most networks."
        }
      },
      {
        "@type": "Question",
        "name": "Which devices are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All modern devices: Chrome, Edge, Firefox, Safari, iOS, Android, tablets, PCs, and Chromebooks."
        }
      },
      {
        "@type": "Question",
        "name": "Are new puzzles added regularly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "New puzzle drops arrive monthly, including community-voted themes and seasonal artwork."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to install anything?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No installation required. Just open your browser, visit jigsolitaire.online, and start playing instantly."
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
