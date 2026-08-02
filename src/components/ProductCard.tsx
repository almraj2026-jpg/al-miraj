import React from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Share2,
  Sparkles,
  Flame,
  CheckCircle,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const {
    language,
    storeConfig,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
    addToast,
  } = useStore();

  const isFavorite = isWishlisted(product.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: language === 'ar' ? product.nameAr : product.nameEn,
          text: language === 'ar' ? product.descriptionAr : product.descriptionEn,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast(
        'info',
        language === 'ar' ? 'تم نسخ الرابط' : 'Link Copied',
        language === 'ar' ? 'تم نسخ رابط المنتج لمشاركته' : 'Product link copied to clipboard'
      );
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.priceDisplayOption === 'out_of_stock' || !product.inStock) {
      addToast(
        'warning',
        language === 'ar' ? 'غير متوفر' : 'Out of Stock',
        language === 'ar' ? 'هذا المنتج نفذت كميته مؤقتاً' : 'Item is currently out of stock'
      );
      return;
    }
    addToCart(product);
  };

  const renderPrice = () => {
    switch (product.priceDisplayOption) {
      case 'contact_us':
        return (
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30">
            {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </span>
        );
      case 'ask_price':
        return (
          <span className="text-xs font-bold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded-lg border border-sky-400/30">
            {language === 'ar' ? 'اسأل عن السعر' : 'Ask for Price'}
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="text-xs font-bold text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-lg border border-rose-400/30">
            {language === 'ar' ? 'غير متوفر حالياً' : 'Out of Stock'}
          </span>
        );
      default:
        return (
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-extrabold text-white">
              {product.price}{' '}
              <span className="text-xs text-sky-400 font-medium">
                {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
              </span>
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {product.oldPrice} {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => onOpenDetail && onOpenDetail(product)}
      className="group relative bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Top Media Thumbnail Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-950">
        <img
          src={product.images[0]}
          alt={language === 'ar' ? product.nameAr : product.nameEn}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Secondary Image view if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={language === 'ar' ? product.nameAr : product.nameEn}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none z-10">
          <div className="flex flex-col gap-1">
            {product.discountPercent && product.discountPercent > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-extrabold shadow-md border border-rose-400/30">
                -{product.discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold shadow-md flex items-center gap-1 border border-blue-400/30">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{language === 'ar' ? 'جديد' : 'NEW'}</span>
              </span>
            )}
            {product.isHot && (
              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 fill-slate-950" />
                <span>{language === 'ar' ? 'فرصة' : 'HOT'}</span>
              </span>
            )}
          </div>

          {/* Quick Action Floating Buttons */}
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition shadow-lg ${
                isFavorite
                  ? 'bg-rose-600/90 text-white border-rose-500'
                  : 'bg-slate-950/60 hover:bg-slate-900 text-slate-300 border-slate-700/60 hover:text-white'
              }`}
              title="المفضلة"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>

            {/* Quick View */}
            <button
              onClick={handleQuickView}
              className="p-2 rounded-full bg-slate-950/60 hover:bg-slate-900 text-slate-300 border border-slate-700/60 hover:text-white backdrop-blur-md transition shadow-lg opacity-90 sm:opacity-0 group-hover:opacity-100"
              title="نظرة سريعة"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-950/60 hover:bg-slate-900 text-slate-300 border border-slate-700/60 hover:text-white backdrop-blur-md transition shadow-lg opacity-90 sm:opacity-0 group-hover:opacity-100"
              title="مشاركة"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Colors Available Pill */}
        {product.colors.length > 0 && (
          <div className="absolute bottom-2.5 right-2.5 rtl:left-2.5 rtl:right-auto flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-full border border-slate-800">
            {product.colors.slice(0, 3).map((col, idx) => (
              <span
                key={idx}
                className="w-2.5 h-2.5 rounded-full border border-slate-600"
                style={{ backgroundColor: col.hex }}
                title={language === 'ar' ? col.nameAr : col.nameEn}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[9px] font-bold text-slate-400">+{product.colors.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1 text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="text-[11px] font-bold text-slate-200">{product.rating}</span>
            <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-300 transition line-clamp-2 leading-snug">
            {language === 'ar' ? product.nameAr : product.nameEn}
          </h3>

          {/* Short Specs / Description */}
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 font-light">
            {language === 'ar' ? product.descriptionAr : product.descriptionEn}
          </p>
        </div>

        {/* Footer Price & Add To Cart Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {renderPrice()}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-2xl bg-blue-600 hover:bg-sky-500 active:scale-95 text-white shadow-lg shadow-blue-600/30 transition border border-blue-400/30 flex items-center justify-center"
            title="أضف إلى السلة"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
