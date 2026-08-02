import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductColor } from '../types';
import {
  X,
  Star,
  ShoppingBag,
  MessageCircle,
  Heart,
  Plus,
  Minus,
  Check,
  Eye,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    language,
    storeConfig,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedProduct,
    setIsCheckoutOpen,
  } = useStore();

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const isFav = isWishlisted(quickViewProduct.id);
  const selectedColor: ProductColor = quickViewProduct.colors[selectedColorIdx] || quickViewProduct.colors[0];
  const selectedSize = quickViewProduct.sizes[selectedSizeIdx] || quickViewProduct.sizes[0];

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedColor, selectedSize, qty);
    setQuickViewProduct(null);
  };

  const handleOpenFullDetails = () => {
    const prod = quickViewProduct;
    setQuickViewProduct(null);
    setSelectedProduct(prod);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto box-sizing-border-box">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Centered Modal Container (90% width, max 450px) */}
      <div className="relative z-10 w-[90vw] max-w-[450px] max-h-[90vh] overflow-y-auto bg-[#0B1120] rounded-3xl border border-blue-500/30 p-4 sm:p-5 shadow-2xl my-auto box-sizing-border-box text-slate-100">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 rtl:left-3 rtl:right-auto z-20 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition border border-slate-700/60"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Thumbnail Preview Image */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-3">
          <img
            src={quickViewProduct.images[selectedImg] || quickViewProduct.images[0]}
            alt={language === 'ar' ? quickViewProduct.nameAr : quickViewProduct.nameEn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          <button
            onClick={() => toggleWishlist(quickViewProduct.id)}
            className={`absolute bottom-3 right-3 rtl:left-3 rtl:right-auto p-2.5 rounded-full backdrop-blur-md border transition shadow-lg ${
              isFav ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-950/70 text-slate-300 border-slate-700/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Header Info */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Al-Miraj Luxury</span>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{quickViewProduct.rating}</span>
          </div>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white font-serif leading-tight">
          {language === 'ar' ? quickViewProduct.nameAr : quickViewProduct.nameEn}
        </h3>

        {/* Price Tag */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-black text-white">
            {quickViewProduct.price}{' '}
            <span className="text-xs text-sky-400 font-semibold">
              {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
            </span>
          </span>
          {quickViewProduct.oldPrice && (
            <span className="text-xs text-slate-500 line-through">
              {quickViewProduct.oldPrice} {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
            </span>
          )}
        </div>

        {/* Description Snippet */}
        <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 font-light leading-relaxed">
          {language === 'ar' ? quickViewProduct.descriptionAr : quickViewProduct.descriptionEn}
        </p>

        {/* Color Selection */}
        {quickViewProduct.colors.length > 0 && (
          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'ar' ? 'اللون:' : 'Color:'}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {quickViewProduct.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-bold transition ${
                    selectedColorIdx === idx
                      ? 'border-sky-400 bg-sky-400/10 text-sky-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-600" style={{ backgroundColor: c.hex }} />
                  <span>{language === 'ar' ? c.nameAr : c.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {quickViewProduct.sizes.length > 0 && (
          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'ar' ? 'المقاس:' : 'Size:'}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {quickViewProduct.sizes.map((sz, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSizeIdx(idx)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition ${
                    selectedSizeIdx === idx
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <span className="font-bold text-slate-300">{language === 'ar' ? 'الكمية:' : 'Qty:'}</span>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-slate-400 hover:text-white">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-white min-w-[20px] text-center">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="text-slate-400 hover:text-white">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95 border border-blue-400/30"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
          </button>

          <button
            onClick={handleOpenFullDetails}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-800"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'ar' ? 'عرض كافة تفاصيل المنتج' : 'View Full Details'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
