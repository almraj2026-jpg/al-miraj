import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ChevronRight, ChevronLeft, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { slides, language, setActiveCategory } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleCtaClick = () => {
    if (currentSlide.linkCategoryId) {
      setActiveCategory(currentSlide.linkCategoryId);
    }
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden border border-blue-500/20 shadow-2xl bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Referrer Policy */}
            <img
              src={currentSlide.image}
              alt={language === 'ar' ? currentSlide.titleAr : currentSlide.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />

            {/* Gradient Overlays for Luxury Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120]/90 via-[#0B1120]/40 to-transparent rtl:bg-gradient-to-l"></div>

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12 max-w-2xl">
              {/* Badge */}
              {(currentSlide.badgeAr || currentSlide.badgeEn) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/40 backdrop-blur-md border border-blue-400/40 text-sky-300 text-xs font-bold w-max mb-3 shadow-lg"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'ar' ? currentSlide.badgeAr : currentSlide.badgeEn}</span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight font-serif drop-shadow-md"
              >
                {language === 'ar' ? currentSlide.titleAr : currentSlide.titleEn}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xs sm:text-sm text-slate-300 mt-2.5 font-light leading-relaxed line-clamp-2 max-w-lg"
              >
                {language === 'ar' ? currentSlide.subtitleAr : currentSlide.subtitleEn}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-5"
              >
                <button
                  onClick={handleCtaClick}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 active:scale-95 transition-all border border-blue-300/30"
                >
                  <span>{language === 'ar' ? currentSlide.ctaTextAr : currentSlide.ctaTextEn}</span>
                  {language === 'ar' ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 -translate-y-1/2 left-3 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-slate-700/50 text-white backdrop-blur-md transition shadow-lg hover:scale-110"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 -translate-y-1/2 right-3 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-slate-700/50 text-white backdrop-blur-md transition shadow-lg hover:scale-110"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 right-6 rtl:left-6 rtl:right-auto flex items-center gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-sky-400' : 'w-2 bg-slate-500/60 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
