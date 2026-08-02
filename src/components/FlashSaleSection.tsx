import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Zap, Clock, Sparkles } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const FlashSaleSection: React.FC = () => {
  const { products, language } = useStore();

  // Filter flash sale products
  const flashProducts = products.filter((p) => p.isFlashSale && !p.isHidden);

  // Countdown timer state (e.g. 14 hours 32 mins 10 secs left)
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-blue-950 via-[#0B1120] to-indigo-950 rounded-3xl p-4 sm:p-6 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg animate-pulse">
              <Zap className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-serif">
                  {language === 'ar' ? 'تخفيضات خاطفة ⚡' : 'Flash Sale ⚡'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
                  {language === 'ar' ? 'كمية محدودة' : 'Limited Stock'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'ar'
                  ? 'عروض اليوم الحصرية على أفخم تشكيلات الملابس والأحذية'
                  : 'Today exclusive limited offers on royal garments'}
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-blue-500/30 p-2 rounded-2xl">
            <Clock className="w-4 h-4 text-sky-400 ml-1" />
            <div className="flex items-center gap-1.5 text-center">
              <div className="bg-blue-600 text-white font-bold text-xs px-2 py-1 rounded-lg min-w-[28px]">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className="bg-blue-600 text-white font-bold text-xs px-2 py-1 rounded-lg min-w-[28px]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className="bg-blue-600 text-white font-bold text-xs px-2 py-1 rounded-lg min-w-[28px]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {flashProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
