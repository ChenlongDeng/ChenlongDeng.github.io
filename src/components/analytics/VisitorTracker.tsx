'use client';

import { useEffect } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const TRACKING_ENABLED = process.env.NODE_ENV === 'production' && Boolean(SUPABASE_URL && SUPABASE_KEY);
const RECORD_INTERVAL_MS = 6 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 6_000;
const VISITOR_ID_KEY = 'chenlongdeng-visitor-id';
const LAST_RECORDED_KEY = 'chenlongdeng-visitor-recorded-at';

interface VisitorLocation {
  country: string;
  city: string;
  lat: number;
  lng: number;
}

interface VisitorTraits {
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  osFamily: 'windows' | 'macos' | 'ios' | 'android' | 'linux' | 'chromeos' | 'other' | 'unknown';
  browserFamily: 'chrome' | 'safari' | 'firefox' | 'edge' | 'opera' | 'samsung' | 'other' | 'unknown';
  language: 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'pt' | 'ru' | 'it' | 'other' | 'unknown';
  screenSize: 'small' | 'medium' | 'large' | 'unknown';
  referrerSource: 'direct' | 'internal' | 'google' | 'bing' | 'baidu' | 'duckduckgo' | 'github' | 'linkedin' | 'twitter' | 'academic' | 'other' | 'unknown';
  entryPage: 'home' | 'publications' | 'other';
}

interface NavigatorUADataLike {
  mobile?: boolean;
  platform?: string;
}

function privacySignalEnabled(): boolean {
  const navigatorWithGpc = navigator as Navigator & { globalPrivacyControl?: boolean };
  return navigator.doNotTrack === '1' || navigatorWithGpc.globalPrivacyControl === true;
}

function makeVisitorId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const visitorId = makeVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
    return visitorId;
  } catch {
    return makeVisitorId();
  }
}

function recentlyRecorded(): boolean {
  try {
    const lastRecorded = Number(localStorage.getItem(LAST_RECORDED_KEY) || 0);
    return Date.now() - lastRecorded < RECORD_INTERVAL_MS;
  } catch {
    return false;
  }
}

function getUserAgentData(): NavigatorUADataLike | undefined {
  return (navigator as Navigator & { userAgentData?: NavigatorUADataLike }).userAgentData;
}

function detectDeviceType(userAgent: string, userAgentData?: NavigatorUADataLike): VisitorTraits['deviceType'] {
  const isIPadOS = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
  if (/iPad|Tablet/i.test(userAgent) || isIPadOS || (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent))) {
    return 'tablet';
  }
  if (userAgentData?.mobile === true || /Mobi|iPhone|iPod/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function detectOsFamily(userAgent: string, userAgentData?: NavigatorUADataLike): VisitorTraits['osFamily'] {
  const platform = userAgentData?.platform?.toLowerCase() || '';
  const isIPadOS = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;

  if (platform.includes('android') || /Android/i.test(userAgent)) return 'android';
  if (platform.includes('ios') || /iPhone|iPad|iPod/i.test(userAgent) || isIPadOS) return 'ios';
  if (platform.includes('windows') || /Windows/i.test(userAgent)) return 'windows';
  if (platform.includes('chrome os') || /CrOS/i.test(userAgent)) return 'chromeos';
  if (platform.includes('mac') || /Mac OS X|Macintosh/i.test(userAgent)) return 'macos';
  if (platform.includes('linux') || /Linux/i.test(userAgent)) return 'linux';
  return 'other';
}

function detectBrowserFamily(userAgent: string): VisitorTraits['browserFamily'] {
  if (/OPR|Opera|OPiOS/i.test(userAgent)) return 'opera';
  if (/SamsungBrowser/i.test(userAgent)) return 'samsung';
  if (/EdgA?|EdgiOS/i.test(userAgent)) return 'edge';
  if (/Firefox|FxiOS/i.test(userAgent)) return 'firefox';
  if (/Chrome|Chromium|CriOS/i.test(userAgent)) return 'chrome';
  if (/Safari/i.test(userAgent)) return 'safari';
  return 'other';
}

function getLanguage(): VisitorTraits['language'] {
  const language = navigator.language?.split('-')[0]?.toLowerCase();
  if (!language) return 'unknown';
  if (['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'it'].includes(language)) {
    return language as VisitorTraits['language'];
  }
  return 'other';
}

function getScreenSize(): VisitorTraits['screenSize'] {
  if (!Number.isFinite(window.innerWidth)) return 'unknown';
  if (window.innerWidth < 768) return 'small';
  if (window.innerWidth < 1280) return 'medium';
  return 'large';
}

function matchesHost(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

function isGoogleHost(host: string): boolean {
  return /^(?:[^.]+\.)*google\.(?:com|[a-z]{2}|(?:co|com)\.[a-z]{2})$/.test(host);
}

function getReferrerSource(): VisitorTraits['referrerSource'] {
  if (!document.referrer) return 'direct';

  try {
    const referrerHost = new URL(document.referrer).hostname.toLowerCase().replace(/^www\./, '');
    const currentHost = window.location.hostname.toLowerCase().replace(/^www\./, '');
    if (!referrerHost) return 'unknown';
    if (referrerHost === currentHost) return 'internal';
    if (isGoogleHost(referrerHost)) return 'google';
    if (matchesHost(referrerHost, 'bing.com')) return 'bing';
    if (matchesHost(referrerHost, 'baidu.com')) return 'baidu';
    if (matchesHost(referrerHost, 'duckduckgo.com')) return 'duckduckgo';
    if (matchesHost(referrerHost, 'github.com')) return 'github';
    if (matchesHost(referrerHost, 'linkedin.com')) return 'linkedin';
    if (matchesHost(referrerHost, 'twitter.com') || matchesHost(referrerHost, 'x.com')) return 'twitter';
    if (
      ['arxiv.org', 'semanticscholar.org', 'dblp.org', 'acm.org', 'ieee.org', 'openreview.net']
        .some((domain) => matchesHost(referrerHost, domain))
    ) return 'academic';
    return 'other';
  } catch {
    return 'unknown';
  }
}

function getEntryPage(): VisitorTraits['entryPage'] {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/') return 'home';
  if (path === '/publications') return 'publications';
  return 'other';
}

function collectVisitorTraits(): VisitorTraits {
  const userAgent = navigator.userAgent || '';
  const userAgentData = getUserAgentData();

  return {
    deviceType: detectDeviceType(userAgent, userAgentData),
    osFamily: detectOsFamily(userAgent, userAgentData),
    browserFamily: detectBrowserFamily(userAgent),
    language: getLanguage(),
    screenSize: getScreenSize(),
    referrerSource: getReferrerSource(),
    entryPage: getEntryPage(),
  };
}

async function locateVisitor(signal: AbortSignal): Promise<VisitorLocation | null> {
  const response = await fetch('https://ipwho.is/?fields=success,country,city,latitude,longitude', {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    referrerPolicy: 'no-referrer',
    signal,
  });
  if (!response.ok) return null;

  const location = await response.json() as {
    success?: boolean;
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  if (location.success !== true || !location.country || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
    return null;
  }

  return {
    country: location.country,
    city: location.city || 'Unknown city',
    // Roughly city-level precision; exact coordinates are neither needed nor stored.
    lat: Math.round((location.latitude as number) * 10) / 10,
    lng: Math.round((location.longitude as number) * 10) / 10,
  };
}

async function recordVisit(visitor: VisitorLocation, traits: VisitorTraits, signal: AbortSignal): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_visit_v2`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY || '',
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      p_visitor_id: getVisitorId(),
      p_country: visitor.country,
      p_city: visitor.city,
      p_lat: visitor.lat,
      p_lng: visitor.lng,
      p_device_type: traits.deviceType,
      p_os_family: traits.osFamily,
      p_browser_family: traits.browserFamily,
      p_language: traits.language,
      p_screen_size: traits.screenSize,
      p_referrer_source: traits.referrerSource,
      p_entry_page: traits.entryPage,
    }),
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
    signal,
  });
  if (!response.ok) throw new Error(`Visitor tracking failed (${response.status})`);

  try {
    localStorage.setItem(LAST_RECORDED_KEY, String(Date.now()));
  } catch {
    // The visit was recorded; persisting the local throttle is optional.
  }
}

export default function VisitorTracker() {
  useEffect(() => {
    if (!TRACKING_ENABLED || privacySignalEnabled() || recentlyRecorded()) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    async function collectVisit() {
      try {
        const visitor = await locateVisitor(controller.signal);
        if (visitor) await recordVisit(visitor, collectVisitorTraits(), controller.signal);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.warn('[visitor-tracker] visit could not be recorded');
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    collectVisit();
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return null;
}
