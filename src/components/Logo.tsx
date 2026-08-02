import React from 'react';
import { useStore } from '../context/StoreContext';

interface LogoProps {
  variant?: 'header' | 'icon' | 'splash' | 'watermark' | 'monogram';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  storeNameAr?: string;
  storeNameEn?: string;
  logoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  size = 'md',
  showText = true,
  className = '',
  storeNameAr: propStoreNameAr,
  storeNameEn: propStoreNameEn,
  logoUrl: propLogoUrl,
}) => {
  let storeConfig: any = null;
  try {
    const store = useStore();
    storeConfig = store.storeConfig;
  } catch {
    // fallback if context is not present
  }

  const storeNameAr = propStoreNameAr || storeConfig?.storeNameAr || 'المعراج';
  const storeNameEn = propStoreNameEn || storeConfig?.storeNameEn || 'AL-MIRAJ';
  const effectiveLogoUrl = propLogoUrl !== undefined ? propLogoUrl : storeConfig?.logoUrl;

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  };

  const iconSizes = {
    sm: 32,
    md: 42,
    lg: 58,
    xl: 84,
  };

  const currentSize = iconSizes[size];

  if (variant === 'icon' || variant === 'splash') {
    return (
      <div className={`inline-flex flex-col items-center justify-center ${className}`}>
        <div className="relative group">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-600 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500"></div>
          
          <div className="relative flex items-center justify-center bg-slate-950 p-2.5 rounded-2xl border border-blue-500/30 shadow-2xl">
            {effectiveLogoUrl ? (
              <img
                src={effectiveLogoUrl}
                alt={storeNameAr}
                style={{ width: currentSize, height: currentSize }}
                className="object-contain rounded-xl transform transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <svg
                width={currentSize}
                height={currentSize}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform transition-transform duration-300 group-hover:scale-105"
              >
                <defs>
                  <linearGradient id="mirajBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#1E3A8A" />
                  </linearGradient>
                  <linearGradient id="goldAccentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FDE047" />
                  </linearGradient>
                  <radialGradient id="glowCenter" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0B1120" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background Glow Ring */}
                <circle cx="50" cy="50" r="42" fill="url(#glowCenter)" />
                <circle cx="50" cy="50" r="44" stroke="url(#mirajBlueGrad)" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.4" />

                {/* Stylized Ascension Arch / Wing (المعراج) */}
                <path
                  d="M 22 72 C 22 42, 42 22, 72 22 C 60 32, 48 48, 48 72 Z"
                  fill="url(#mirajBlueGrad)"
                />
                <path
                  d="M 32 78 C 32 52, 50 34, 78 34 C 68 44, 56 58, 56 78 Z"
                  fill="url(#mirajBlueGrad)"
                  opacity="0.85"
                />
                {/* Crescent Accent (الهلال الملكي) */}
                <path
                  d="M 68 28 C 76 28, 82 34, 82 42 C 78 38, 72 38, 68 42 C 66 38, 66 32, 68 28 Z"
                  fill="#38BDF8"
                />
                {/* Diamond Star */}
                <polygon points="74,18 77,24 83,27 77,30 74,36 71,30 65,27 71,24" fill="url(#goldAccentGrad)" />
              </svg>
            )}
          </div>
        </div>

        {showText && (
          <div className="mt-3 text-center">
            <span className="block text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent tracking-wide font-serif">
              {storeNameAr}
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.25em] text-sky-400/90 uppercase mt-0.5">
              {storeNameEn}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Header / Default Logo
  return (
    <div className={`inline-flex items-center gap-2.5 ${sizeClasses[size]} ${className}`}>
      <div className="relative group flex-shrink-0">
        <div className="absolute -inset-1 bg-blue-600/30 rounded-xl blur-sm group-hover:opacity-100 opacity-70 transition"></div>
        <div className="relative bg-slate-900/90 border border-blue-500/30 p-1.5 rounded-xl flex items-center justify-center shadow-lg">
          {effectiveLogoUrl ? (
            <img
              src={effectiveLogoUrl}
              alt={storeNameAr}
              style={{ width: currentSize, height: currentSize }}
              className="object-contain rounded-lg transform transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <svg
              width={currentSize}
              height={currentSize}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="hdrBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>

              {/* Arch / Wing Curve */}
              <path
                d="M 22 72 C 22 42, 42 22, 72 22 C 60 32, 48 48, 48 72 Z"
                fill="url(#hdrBlueGrad)"
              />
              <path
                d="M 34 78 C 34 56, 50 40, 78 40 C 68 48, 58 60, 58 78 Z"
                fill="#1D4ED8"
                opacity="0.9"
              />
              {/* Crown Star */}
              <polygon points="72,16 75,22 81,25 75,28 72,34 69,28 63,25 69,22" fill="#F59E0B" />
            </svg>
          )}
        </div>
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent font-serif">
              {storeNameAr}
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-600/30 border border-blue-400/40 text-sky-300 rounded-full tracking-wider">
              فخامة
            </span>
          </div>
          <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
            {storeNameEn}
          </span>
        </div>
      )}
    </div>
  );
};
