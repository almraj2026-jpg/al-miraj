import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ArrowLeft, ArrowRight, Store, Sparkles, X, ChevronUp } from 'lucide-react';

export const FloatingStickyCart: React.FC = () => {
  const { cart, language, storeConfig, setIsCartOpen } = useStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Trigger brief bounce animation on total items change
  useEffect(() => {
    if (totalItems > 0) {
      setJustAdded(true);
      const timer = setTimeout(() => setJustAdded(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed bottom-20 left-3 right-3 sm:left-6 sm:right-auto md:bottom-6 z-40 max-w-sm"
      >
        {isMinimized ? (
          /* Minimized Sticky Badge */
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-800 text-white shadow-2xl shadow-blue-600/50 border border-blue-400/40 backdrop-blur-xl font-bold text-xs"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-950">
                {totalItems}
              </span>
            </div>
            <span>{language === 'ar' ? 'سلة المشتريات الملاحقة' : 'Floating Cart'}</span>
            <span className="text-amber-300 font-extrabold mr-1">
              {subtotal} {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
            </span>
            <ChevronUp className="w-4 h-4 text-slate-300" />
          </motion.button>
        ) : (
          /* Full Sticky Floating Cart Card (سلة ملاحقة) */
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 border border-sky-500/40 p-3.5 shadow-2xl shadow-blue-950/80 backdrop-blur-2xl text-white">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header / Minimize bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{language === 'ar' ? 'سلة المشتريات الملاحقة 🛒' : 'Sticky Floating Cart'}</span>
                </span>
              </div>

              <button
                onClick={() => setIsMinimized(true)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition text-[10px] flex items-center gap-1"
                title="تصغير"
              >
                <span>{language === 'ar' ? 'إخفاء' : 'Hide'}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Content Info */}
            <div className="flex items-center justify-between gap-3 my-1">
              {/* Bag icon with count */}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={justAdded ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : {}}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 flex items-center justify-center relative shadow-md border border-blue-400/30 flex-shrink-0"
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full border border-slate-950 shadow">
                    {totalItems}
                  </span>
                </motion.div>

                <div>
                  <div className="text-xs text-slate-300 font-medium">
                    {language === 'ar'
                      ? `${totalItems} ${totalItems === 1 ? 'منتج في السلة' : 'منتجات في السلة'}`
                      : `${totalItems} items in cart`}
                  </div>
                  <div className="text-sm font-black text-amber-300">
                    {subtotal}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* In-Store Pickup tag */}
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                  <Store className="w-3 h-3 text-amber-300" />
                  <span>{language === 'ar' ? 'استلام من المحل' : 'In-Store Pickup'}</span>
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 border border-blue-400/30 active:scale-[0.99]"
            >
              <span>{language === 'ar' ? 'معاينة السلة وإتمام الطلب' : 'View Cart & Checkout'}</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
