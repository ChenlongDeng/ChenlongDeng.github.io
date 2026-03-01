import type { Metadata } from "next";
import { execSync } from "child_process";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { getConfig } from "@/lib/config";

function getGitLastUpdated(): string {
  try {
    const date = execSync('git log -1 --format=%cd --date=format:"%B %d, %Y"', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return date || '';
  } catch {
    return '';
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = getConfig();
  return {
    title: {
      default: config.site.title,
      template: `%s | ${config.site.title}`
    },
    description: config.site.description,
    keywords: [config.author.name, "PhD", "Research", config.author.institution],
    authors: [{ name: config.author.name }],
    creator: config.author.name,
    publisher: config.author.name,
    icons: {
      icon: config.site.favicon,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: config.site.title,
      description: config.site.description,
      siteName: `${config.author.name}'s Academic Website`,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getConfig();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Theme detection script - must run first to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Always use current system preference (no persistence)
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                const effective = prefersDark ? 'dark' : 'light';
                document.documentElement.classList.add(effective);
                document.documentElement.setAttribute('data-theme', effective);
              })();
            `,
          }}
        />
        <link rel="icon" href={config.site.favicon} type="image/svg+xml" />
        {/* Speed up font connections */}
        <link rel="dns-prefetch" href="https://google-fonts.jialeliu.com" />
        <link rel="preconnect" href="https://google-fonts.jialeliu.com" crossOrigin="" />
        {/* Non-blocking Google Fonts: preload + print media swap to avoid render-blocking */}
        <link
          rel="preload"
          as="style"
          href="https://google-fonts.jialeliu.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
        />
        <link
          rel="stylesheet"
          id="gfonts-css"
          href="https://google-fonts.jialeliu.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
          media="print"
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var l = document.getElementById('gfonts-css');
                if (!l) return;
                if (l.media !== 'all') {
                  l.addEventListener('load', function(){ try { l.media = 'all'; } catch(e){} });
                }
              })();
            `,
          }}
        />
        <noscript>
          {/* Fallback for no-JS environments */}
          <link
            rel="stylesheet"
            href="https://google-fonts.jialeliu.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap"
          />
        </noscript>
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <Navigation
            items={config.navigation}
            siteTitle={config.site.title}
            enableOnePageMode={config.features.enable_one_page_mode}
          />
          <main className="min-h-screen pt-16 lg:pt-20">
            {children}
          </main>
          <Footer lastUpdated={getGitLastUpdated() || config.site.last_updated} />
        </ThemeProvider>
      </body>
    </html>
  );
}
