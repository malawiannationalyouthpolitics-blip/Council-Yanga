import { type ReactNode } from 'react';
import logoImg from '@/imports/Council_Yanga_Logo-1.png';
export { PartnerLogo } from './PartnerLogo';

export function Logo({ className = 'h-10' }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="Council Yanga"
      className={`${className} w-auto object-contain flex-shrink-0`}
    />
  );
}

export const STATUS_BG: Record<string, string> = {
  Completed: '#016630',
  Ongoing: '#2563eb',
  'Near Completion': '#d97706',
  'Not Started': '#6b7280',
  Proposed: '#7c3aed',
  Assessed: '#0891b2',
  Approved: '#16a34a',
  Suspended: '#dc2626',
  'On Hold': '#ea580c',
  Stalled: '#374151',
  Active: '#016630',
  Inactive: '#dc2626',
  Published: '#016630',
};

export function StatusBadge({ status }: { status: string }) {
  const bg = STATUS_BG[status] ?? '#6b7280';
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold text-white whitespace-nowrap"
      style={{ background: bg, borderRadius: '0.2rem' }}
    >
      {status}
    </span>
  );
}

export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  const color =
    value === 100
      ? 'bg-green-500'
      : value >= 75
        ? 'bg-emerald-500'
        : value >= 40
          ? 'bg-blue-500'
          : 'bg-gray-400';
  return (
    <div className={`w-full bg-gray-200 rounded-full h-1.5 ${className}`}>
      <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: string;
  sub?: string;
}

export function StatCard({ label, value, icon, sub }: StatCardProps) {
  const valStr = String(value);
  const isLong = valStr.length > 10;
  return (
    <div className="flex flex-col items-center justify-center text-center gap-1.5 p-3 sm:p-4 shadow-sm" style={{ background: '#016630', borderRadius: '0.2rem', minHeight: '110px' }}>
      <div className="text-white flex items-center justify-center">{icon}</div>
      <p className={`${isLong ? 'text-base sm:text-lg xl:text-xl' : 'text-xl sm:text-2xl'} font-black text-white leading-tight tracking-tight`} style={{ fontFamily: 'Outfit, sans-serif' }}>
        {value}
      </p>
      <p className="text-[11px] font-semibold text-white/90 leading-tight">{label}</p>
      {sub && <p className="text-[10px] text-white/75">{sub}</p>}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{children}</h2>;
}

interface CardProps { children: ReactNode; className?: string }

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-green-100 shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

export function FeedbackStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Received: '#2563eb',
    'Under Review': '#d97706',
    'Verification Requested': '#7c3aed',
    Resolved: '#016630',
    Rejected: '#dc2626',
  };
  const bg = colors[status] ?? '#6b7280';
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 text-white whitespace-nowrap"
      style={{ background: bg, borderRadius: '0.2rem' }}
    >
      {status}
    </span>
  );
}

export function AnnouncementCategoryBadge({ category }: { category: string }) {
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 text-white whitespace-nowrap"
      style={{ background: '#016630', borderRadius: '0.2rem' }}
    >
      {category}
    </span>
  );
}

export function CategoryBadge({ category, className = '' }: { category: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 text-white whitespace-nowrap ${className}`}
      style={{ background: '#145a32', borderRadius: '0.2rem' }}
    >
      {category}
    </span>
  );
}

export function CheckIcon({ size = 20, variant = 'green', className = '' }: { size?: number; variant?: 'green' | 'white'; className?: string }) {
  const circleFill = variant === 'white' ? 'rgba(255,255,255,0.18)' : '#22c55e';
  const stroke = 'white';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="12" fill={circleFill} />
      <path d="M6.5 12.5l3.8 3.8 7.2-8" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmptyState({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <div className="mb-3 opacity-40">{icon}</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ThreeDotsLoading({
  className = '',
  dotColor = 'bg-white',
  size = 'w-2 h-2',
}: {
  className?: string;
  dotColor?: string;
  size?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className={`${size} rounded-full ${dotColor}`}
          style={{
            animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
