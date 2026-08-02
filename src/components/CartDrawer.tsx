import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    language,
    storeConfig,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end rtl:justify-start">
      {/* Dimmed Overlay Backdrop - Click outside closes drawer */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative z-[1001] w-[280px] sm:w-[360px] max-w-full h-full bg-[#0B1120] border-l rtl:border-r rtl:border-l-0 border-blue-900/40 shadow-2xl flex flex-col justify-between overflow-hidden box-sizing-border-box">
        {/* Drawer Header */}
        <div className="p-3.5 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white font-serif">
              {language === 'ar' ? 'سلة المشتريات' : 'Shopping Cart'}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-sky-300 text-[10px] font-bold border border-blue-500/30">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition flex items-center gap-1"
                title={language === 'ar' ? 'إفراغ السلة بالكامل' : 'Clear All'}
              >
                <Trash2 className="w-3 h-3" />
                <span>{language === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
                <ShoppingBag className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-300">
                {language === 'ar' ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                {language === 'ar' ? 'استمتع بتصفح تشكيلة المعراج الفاخرة وأضف قطعك المفضلة' : 'Discover luxury items and add them to your cart'}
              </p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor?.hex}-${item.selectedSize}-${index}`}
                className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex gap-2.5 items-center justify-between"
              >
                {/* Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={language === 'ar' ? item.product.nameAr : item.product.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {language === 'ar' ? item.product.nameAr : item.product.nameEn}
                  </h4>

                  {/* Specs Pill */}
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                    {item.selectedColor && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full border border-slate-600 inline-block" style={{ backgroundColor: item.selectedColor.hex }} />
                        <span>{language === 'ar' ? item.selectedColor.nameAr : item.selectedColor.nameEn}</span>
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {item.selectedSize}
                      </span>
                    )}
                  </div>

                  {/* Unit Price & Total */}
                  <div className="text-xs font-bold text-sky-400 mt-1">
                    {item.product.price * item.quantity}{' '}
                    <span className="text-[9px] text-slate-400 font-normal">
                      {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col items-end justify-between gap-1 flex-shrink-0">
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-slate-500 hover:text-rose-400 transition p-1"
                    title={language === 'ar' ? 'إزالة من السلة' : 'Remove item'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.cartId, -1)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                      aria-label="تقليل الكمية"
                      title={language === 'ar' ? 'إنقاص' : 'Decrease'}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-white px-1.5">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cartId, 1)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                      aria-label="زيادة الكمية"
                      title={language === 'ar' ? 'زيادة' : 'Increase'}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-slate-900/90 border-t border-slate-800 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-bold text-white">
                  {subtotal} {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{language === 'ar' ? 'طريقة الاستلام:' : 'Pickup Method:'}</span>
                <span className="font-bold text-amber-400">
                  {language === 'ar' ? 'استلام من المحل (مجاناً)' : 'In-Store Pickup (Free)'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-white">{language === 'ar' ? 'الإجمالي الكلي:' : 'Total:'}</span>
              <span className="text-base font-extrabold text-sky-400">
                {subtotal}{' '}
                <span className="text-xs text-slate-400 font-normal">
                  {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
                </span>
              </span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95 border border-blue-400/30"
            >
              <span>{language === 'ar' ? 'متابعة وإتمام الشراء' : 'Proceed to Checkout'}</span>
              {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
