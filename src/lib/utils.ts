import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatYear(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric'
  }).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractYearFromText(text: string): string | null {
  const match = text.match(/\b(20\d{2})\b/);
  return match ? match[1] : null;
}

export function formatVenueDisplay(venue?: string, year?: number): string {
  if (!venue) return year ? String(year) : '';

  const value = venue.trim();
  const upper = value.toUpperCase();
  const yearInVenue = extractYearFromText(value);
  const displayYear = yearInVenue || (year ? String(year) : '');

  if (upper.includes('ACM TRANSACTIONS ON INFORMATION SYSTEMS') || upper.includes('TOIS')) {
    return displayYear ? `TOIS ${displayYear}` : 'TOIS';
  }
  if (upper.includes('EMNLP')) {
    if (upper.includes('FINDINGS')) {
      return displayYear ? `EMNLP ${displayYear} Findings` : 'EMNLP Findings';
    }
    return displayYear ? `EMNLP ${displayYear}` : 'EMNLP';
  }
  if (upper.includes('ACL')) {
    if (upper.includes('FINDINGS')) {
      return displayYear ? `ACL ${displayYear} Findings` : 'ACL Findings';
    }
    return displayYear ? `ACL ${displayYear}` : 'ACL';
  }
  if (upper.includes('NEURIPS')) {
    return displayYear ? `NeurIPS ${displayYear}` : 'NeurIPS';
  }
  if (upper.includes('WSDM') || upper.includes('WEB SEARCH AND DATA MINING')) {
    return displayYear ? `WSDM ${displayYear}` : 'WSDM';
  }
  if (upper.includes('ARXIV')) {
    return 'arXiv';
  }

  if (yearInVenue) return value;
  return displayYear ? `${value} ${displayYear}` : value;
}
