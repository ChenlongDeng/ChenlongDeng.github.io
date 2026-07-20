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

async function recordVisit(visitor: VisitorLocation, signal: AbortSignal): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_visit`, {
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
        if (visitor) await recordVisit(visitor, controller.signal);
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
