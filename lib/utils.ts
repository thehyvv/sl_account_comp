import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'LKR'): string {
  if (currency === 'LKR') {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatTenure(months: number): string {
  if (months < 12) {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }
  return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
}

export function getRiskBadgeClass(riskTier: string): string {
  switch (riskTier) {
    case 'low':
      return 'badge-risk-low';
    case 'moderate':
      return 'badge-risk-moderate';
    case 'elevated':
      return 'badge-risk-elevated';
    case 'high':
      return 'badge-risk-high';
    default:
      return 'badge-risk-moderate';
  }
}

export function getRiskLabel(riskTier: string): string {
  switch (riskTier) {
    case 'low':
      return 'Low Risk';
    case 'moderate':
      return 'Moderate Risk';
    case 'elevated':
      return 'Elevated Risk';
    case 'high':
      return 'High Risk';
    default:
      return 'Moderate Risk';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function generateBankSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
