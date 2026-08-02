import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductColor } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Heart,
  Share2,
  ShoppingBag,
  MessageCircle,
  Plus,
  Minus,
  Check,
  Store,
  ShieldCheck,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const {
    language,
    storeConfig,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCheckoutOpen,
    reviews,
    addReview,
    products,
    addToast,
  } = useStore();

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [qty, setQty] = useState(1);

  // New review state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('طرابلس');
  const [newRating, setNewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const isFav = isWishlisted(product.id);
  const selectedColor: ProductColor = product.colors[selectedColorIdx] || product.colors[0];
  const selectedSize = product.sizes[selectedSizeIdx] || product.sizes[0];

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && !p.isHidden)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, qty);
  };

  const handleWhatsAppOrder = () => {
    addToCart(product, selectedColor, selectedSize, qty);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      addToast(
        'warning',
        language === 'ar' ? 'تنبيه' : 'Warning',
        language === 'ar' ? 'يرجى كتابة الاسم والتعليق' : 'Please fill name and review'
      );
      return;
    }
    addReview({
      userName: reviewerName,
      userCity: reviewerCity,
      rating: newRating,
      commentAr: reviewComment,
      commentEn: reviewComment,
      productName: language === 'ar' ? product.nameAr : product.nameEn,
    });
    setReviewerName('');
    setReviewComment('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 select-none">
      {/* Top Back Navigation Bar */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition mb-6 shadow-md"
      >
        {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span className="text-xs font-bold">{language === 'ar' ? 'الرجوع للمتجر' : 'Back to Store'}</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0B1120] p-4 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl">
        {/* Left Column: Gallery (5 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
            <img
              src={product.images[selectedImg] || product.images[0]}
              alt={language === 'ar' ? product.nameAr : product.nameEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 rtl:left-4 rtl:right-auto p-3 rounded-full backdrop-blur-md border shadow-xl transition ${
                isFav ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-950/70 text-slate-300 border-slate-700/60 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImg === idx ? 'border-sky-400 ring-2 ring-sky-400/40' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Gallery" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Specs & Options (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-sky-400 tracking-wider uppercase">
                {language === 'ar' ? 'ماركة المعراج الفاخرة' : 'Al-Miraj Royal Luxury'}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-500">({product.reviewCount} {language === 'ar' ? 'تقييم' : 'reviews'})</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif leading-tight">
              {language === 'ar' ? product.nameAr : product.nameEn}
            </h1>

            {/* Price Box */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">{language === 'ar' ? 'السعر الاصلي:' : 'Store Price:'}</span>
                <span className="text-3xl font-black text-white">
                  {product.price}{' '}
                  <span className="text-sm font-semibold text-sky-400">
                    {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
                  </span>
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-slate-400 line-through mr-3 rtl:ml-3 rtl:mr-0">
                    {product.oldPrice} {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
                  </span>
                )}
              </div>

              {product.inStock ? (
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  {language === 'ar' ? 'متوفر في المخزن' : 'In Stock'}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30">
                  {language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-light">
              {language === 'ar' ? product.descriptionAr : product.descriptionEn}
            </p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-6">
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  {language === 'ar' ? 'اختر اللون:' : 'Choose Color:'}{' '}
                  <span className="text-sky-400">{language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn}</span>
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-bold transition ${
                        selectedColorIdx === idx
                          ? 'border-sky-400 bg-sky-400/10 text-sky-300 ring-2 ring-sky-400/30'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600" style={{ backgroundColor: col.hex }} />
                      <span>{language === 'ar' ? col.nameAr : col.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mt-6">
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  {language === 'ar' ? 'اختر القياس:' : 'Choose Size:'}
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.sizes.map((sz, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSizeIdx(idx)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold border transition ${
                        selectedSizeIdx === idx
                          ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs font-bold text-slate-300">{language === 'ar' ? 'الكمية:' : 'Quantity:'}</span>
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-slate-400 hover:text-white transition">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-white min-w-[24px] text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="text-slate-400 hover:text-white transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Store Pickup & Guarantee Info */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-800 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <Store className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-300 block">
                  {language === 'ar' ? 'الاستلام من المحل' : 'In-Store Pickup'}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-300 block">
                  {language === 'ar' ? 'ضمان جودة الأصالة' : '100% Authentic'}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                <Clock className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-slate-300 block">
                  {language === 'ar' ? 'تجهيز فوري للطلب' : 'Instant Order Prep'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 transition border border-blue-400/30"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{language === 'ar' ? 'إضافة إلى سلة التسوق' : 'Add to Shopping Cart'}</span>
              </button>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition border border-emerald-400/30"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{language === 'ar' ? 'طلب فوري ومباشر عبر الواتساب' : 'Instant WhatsApp Order'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="mt-8 bg-[#0B1120] p-6 rounded-3xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 font-serif">
            {language === 'ar' ? 'المواصفات والتفاصيل الفنية' : 'Technical Specifications'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-400">{language === 'ar' ? spec.keyAr : spec.keyEn}</span>
                <span className="font-bold text-white">{language === 'ar' ? spec.valAr : spec.valEn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="mt-8 bg-[#0B1120] p-6 rounded-3xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4 font-serif flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>{language === 'ar' ? 'آراء وتقييمات الزبائن' : 'Customer Reviews'}</span>
        </h3>

        {/* Reviews List */}
        <div className="space-y-4 mb-6">
          {reviews
            .filter((r) => !r.productName || r.productName === (language === 'ar' ? product.nameAr : product.nameEn))
            .slice(0, 4)
            .map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600/30 text-sky-400 font-bold flex items-center justify-center text-xs border border-blue-500/30">
                      {rev.userName[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{rev.userName}</h4>
                      <span className="text-[10px] text-slate-400">{rev.userCity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {language === 'ar' ? rev.commentAr : rev.commentEn}
                </p>
              </div>
            ))}
        </div>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <h4 className="text-xs font-bold text-sky-400 mb-3">{language === 'ar' ? 'أضف تقييمك للقطعة' : 'Write a Review'}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder={language === 'ar' ? 'اسمك الكريم' : 'Your Name'}
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <select
              value={reviewerCity}
              onChange={(e) => setReviewerCity(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="طرابلس">طرابلس (Tripoli)</option>
              <option value="بنغازي">بنغازي (Benghazi)</option>
              <option value="مصراتة">مصراتة (Misrata)</option>
              <option value="الزاوية">الزاوية (Zawia)</option>
              <option value="سبها">سبها (Sebha)</option>
              <option value="الخمس">الخمس (Khoms)</option>
            </select>
          </div>
          <textarea
            rows={2}
            placeholder={language === 'ar' ? 'اكتب رأيك بصراحة...' : 'Your experience with this item...'}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 mb-3"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'نشر التقييم' : 'Submit Review'}</span>
          </button>
        </form>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6 font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <span>{language === 'ar' ? 'قطع مشابهة ذات ذوق رفيع' : 'Related Products'}</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
