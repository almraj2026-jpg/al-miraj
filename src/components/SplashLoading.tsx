import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export const SplashLoading: React.FC = () => {
  const { splashActive, dismissSplash, storeConfig, language } = useStore();

  if (!splashActive) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[10000] bg-[#0B1120] flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden"
    >
      {/* Radial Blue Glow Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Top Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sky-400 text-xs font-semibold tracking-wider"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          {language === 'ar' ? storeConfig.sloganAr : storeConfig.sloganEn}
        </span>
      </motion.div>

      {/* Center Animated Logo */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm my-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <Logo
            variant="splash"
            size="xl"
            showText={true}
            storeNameAr={storeConfig.storeNameAr}
            storeNameEn={storeConfig.storeNameEn}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-sm text-slate-300 font-light leading-relaxed px-4"
        >
          {language === 'ar'
            ? 'أجود الموضة والأزياء الملكية متاحة للاستلام المباشر من فرعنا الرئيسي'
            : 'Premium fashion & luxury apparel available for direct store pickup'}
        </motion.p>
      </div>

      {/* Bottom CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-xs"
      >
        <button
          onClick={dismissSplash}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-3 border border-blue-400/30"
        >
          <span className="text-base tracking-wide font-serif">
            {language === 'ar' ? 'تصفح تشكيلة المعراج' : 'Enter Al-Miraj Store'}
          </span>
          {language === 'ar' ? (
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
          ) : (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};
