'use client';

interface FooterProps {
  lastUpdated?: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200/50 bg-neutral-50/50 dark:bg-neutral-900/50 dark:border-neutral-700/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-neutral-500">
            Last updated: {lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-neutral-500">Personal academic website</p>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[0.68rem] leading-relaxed text-neutral-400 dark:text-neutral-500">
          Privacy: anonymous visitor statistics use a random browser identifier and an approximate city lookup by{' '}
          <a
            href="https://ipwhois.io/privacy"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-600 dark:decoration-neutral-600 dark:hover:text-neutral-300"
          >
            ipwhois.io
          </a>
          ; this site does not store IP addresses. Do Not Track and Global Privacy Control are respected.
        </p>
      </div>
    </footer>
  );
}
