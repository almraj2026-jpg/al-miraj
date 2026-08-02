import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Product, PriceOption, Category, SliderSlide, Review } from '../../types';
import { ImageUploader } from '../ImageUploader';
import { Logo } from '../Logo';
import {
  X,
  Shield,
  Package,
  Grid,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Sparkles,
  Flame,
  Tag,
  CheckCircle,
  Save,
  RotateCcw,
  Palette,
  Phone,
  CreditCard,
  Globe,
  DollarSign,
  Sliders,
  ArrowUp,
  ArrowDown,
  Layers,
  Upload,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    language,
    storeConfig,
    updateStoreConfig,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductVisibility,
    setProductPriceOption,
    categories,
    addCategory,
    deleteCategory,
    slides,
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlides,
    reviews,
    deleteReview,
    resetToDefaults,
    addToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'slides' | 'branding' | 'reviews'>('products');

  // New Product Modal State
  const [isAddingProd, setIsAddingProd] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);

  const [prodNameAr, setProdNameAr] = useState('');
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodPrice, setProdPrice] = useState('250');
  const [prodOldPrice, setProdOldPrice] = useState('320');
  const [prodCatId, setProdCatId] = useState('men');
  const [prodDescAr, setProdDescAr] = useState('');
  const [prodImgUrl, setProdImgUrl] = useState('');
  const [prodDisplayOpt, setProdDisplayOpt] = useState<PriceOption>('show');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodIsFlashSale, setProdIsFlashSale] = useState(false);
  const [prodIsNew, setProdIsNew] = useState(true);

  // New Category State
  const [catNameAr, setCatNameAr] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catImgUrl, setCatImgUrl] = useState('');

  // Store Config Settings Form
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [cfgLogoUrl, setCfgLogoUrl] = useState(storeConfig.logoUrl || '');
  const [cfgWhatsApp, setCfgWhatsApp] = useState(storeConfig.whatsAppNumber);
  const [cfgMis, setCfgMis] = useState(storeConfig.misNumber);
  const [cfgStoreAr, setCfgStoreAr] = useState(storeConfig.storeNameAr);
  const [cfgStoreEn, setCfgStoreEn] = useState(storeConfig.storeNameEn);
  const [cfgFb, setCfgFb] = useState(storeConfig.facebookUrl);
  const [cfgTt, setCfgTt] = useState(storeConfig.tikTokUrl);
  const [cfgIg, setCfgIg] = useState(storeConfig.instagramUrl);
  const [cfgNotice, setCfgNotice] = useState(storeConfig.noticeBannerAr || '');
  const [cfgAddressAr, setCfgAddressAr] = useState(storeConfig.addressAr || '');
  const [cfgAddressEn, setCfgAddressEn] = useState(storeConfig.addressEn || '');

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/i)) {
      alert('يرجى اختيار صورة بصيغة صالحة (PNG, JPG, JPEG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCfgLogoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Slider Management State
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  const [slideTitleAr, setSlideTitleAr] = useState('');
  const [slideTitleEn, setSlideTitleEn] = useState('');
  const [slideSubtitleAr, setSlideSubtitleAr] = useState('');
  const [slideSubtitleEn, setSlideSubtitleEn] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideBadgeAr, setSlideBadgeAr] = useState('');
  const [slideBadgeEn, setSlideBadgeEn] = useState('');
  const [slideCtaTextAr, setSlideCtaTextAr] = useState('تسوق الآن');
  const [slideCtaTextEn, setSlideCtaTextEn] = useState('Shop Now');
  const [slideLinkCatId, setSlideLinkCatId] = useState('men');

  if (!isAdminOpen) return null;

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitleAr.trim()) return;

    const img = slideImage.trim() || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200';

    if (editingSlideId) {
      updateSlide(editingSlideId, {
        titleAr: slideTitleAr,
        titleEn: slideTitleEn || slideTitleAr,
        subtitleAr: slideSubtitleAr,
        subtitleEn: slideSubtitleEn || slideSubtitleAr,
        image: img,
        badgeAr: slideBadgeAr,
        badgeEn: slideBadgeEn || slideBadgeAr,
        ctaTextAr: slideCtaTextAr || 'تسوق الآن',
        ctaTextEn: slideCtaTextEn || 'Shop Now',
        linkCategoryId: slideLinkCatId,
      });
      addToast('success', language === 'ar' ? 'تم تحديث الشريحة' : 'Slide Updated', language === 'ar' ? 'تم حفظ التعديلات وتحديث السلايدر مباشرة' : 'Slide updated successfully');
    } else {
      addSlide({
        titleAr: slideTitleAr,
        titleEn: slideTitleEn || slideTitleAr,
        subtitleAr: slideSubtitleAr || 'أحدث الصيحات الملكية والتشكيلات الحصرية',
        subtitleEn: slideSubtitleEn || 'Latest luxury trends & royal collections',
        image: img,
        badgeAr: slideBadgeAr || 'تشكيلة جديدة 2026',
        badgeEn: slideBadgeEn || 'New Collection 2026',
        ctaTextAr: slideCtaTextAr || 'تسوق الآن',
        ctaTextEn: slideCtaTextEn || 'Shop Now',
        linkCategoryId: slideLinkCatId,
      });
      addToast('success', language === 'ar' ? 'تمت إضافة الشريحة' : 'Slide Added', language === 'ar' ? 'تم إضافة الشريحة الجديدة إلى السلايدر الرئيسي' : 'New slide added to hero banner');
    }

    setIsAddingSlide(false);
    setEditingSlideId(null);
    setSlideTitleAr('');
    setSlideTitleEn('');
    setSlideSubtitleAr('');
    setSlideSubtitleEn('');
    setSlideImage('');
    setSlideBadgeAr('');
    setSlideBadgeEn('');
    setSlideCtaTextAr('تسوق الآن');
    setSlideCtaTextEn('Shop Now');
  };

  const startEditSlide = (s: SliderSlide) => {
    setEditingSlideId(s.id);
    setSlideTitleAr(s.titleAr);
    setSlideTitleEn(s.titleEn);
    setSlideSubtitleAr(s.subtitleAr);
    setSlideSubtitleEn(s.subtitleEn);
    setSlideImage(s.image);
    setSlideBadgeAr(s.badgeAr || '');
    setSlideBadgeEn(s.badgeEn || '');
    setSlideCtaTextAr(s.ctaTextAr);
    setSlideCtaTextEn(s.ctaTextEn);
    setSlideLinkCatId(s.linkCategoryId || 'men');
    setIsAddingSlide(true);
  };

  const handleMoveSlideUp = (index: number) => {
    if (index <= 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index - 1];
    newSlides[index - 1] = temp;
    reorderSlides(newSlides);
  };

  const handleMoveSlideDown = (index: number) => {
    if (index >= slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + 1];
    newSlides[index + 1] = temp;
    reorderSlides(newSlides);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNameAr.trim() || !prodPrice) return;

    const img = prodImgUrl.trim() || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800';

    if (editingProdId) {
      updateProduct(editingProdId, {
        nameAr: prodNameAr,
        nameEn: prodNameEn || prodNameAr,
        price: Number(prodPrice),
        oldPrice: prodOldPrice ? Number(prodOldPrice) : undefined,
        categoryId: prodCatId,
        descriptionAr: prodDescAr,
        priceDisplayOption: prodDisplayOpt,
        isFeatured: prodIsFeatured,
        isFlashSale: prodIsFlashSale,
        isNew: prodIsNew,
        images: [img],
      });
      setEditingProdId(null);
    } else {
      addProduct({
        nameAr: prodNameAr,
        nameEn: prodNameEn || prodNameAr,
        descriptionAr: prodDescAr || 'قطعة فاخرة من تشكيلة المعراج الملكية المصممة بعناية',
        descriptionEn: 'Luxury garment from Al-Miraj royal collection',
        categoryId: prodCatId,
        price: Number(prodPrice),
        oldPrice: prodOldPrice ? Number(prodOldPrice) : undefined,
        priceDisplayOption: prodDisplayOpt,
        images: [img],
        colors: [
          { nameAr: 'كحلي ملكي', nameEn: 'Royal Navy', hex: '#1E3A8A' },
          { nameAr: 'أسود فاخر', nameEn: 'Black', hex: '#111827' }
        ],
        sizes: ['S', 'M', 'L', 'XL', '40', '42'],
        inStock: true,
        stockQuantity: 15,
        rating: 5.0,
        reviewCount: 1,
        isFeatured: prodIsFeatured,
        isTrending: true,
        isNew: prodIsNew,
        isHot: prodIsFlashSale,
        isFlashSale: prodIsFlashSale,
        isBestSeller: false,
        isHidden: false,
      });
    }

    setIsAddingProd(false);
    setProdNameAr('');
    setProdNameEn('');
    setProdPrice('250');
    setProdDescAr('');
    setProdImgUrl('');
  };

  const startEditProduct = (p: Product) => {
    setEditingProdId(p.id);
    setProdNameAr(p.nameAr);
    setProdNameEn(p.nameEn);
    setProdPrice(p.price.toString());
    setProdOldPrice(p.oldPrice ? p.oldPrice.toString() : '');
    setProdCatId(p.categoryId);
    setProdDescAr(p.descriptionAr);
    setProdImgUrl(p.images[0] || '');
    setProdDisplayOpt(p.priceDisplayOption);
    setProdIsFeatured(p.isFeatured);
    setProdIsFlashSale(p.isFlashSale);
    setProdIsNew(p.isNew);
    setIsAddingProd(true);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameAr.trim()) return;
    addCategory({
      nameAr: catNameAr,
      nameEn: catNameEn || catNameAr,
      icon: 'Sparkles',
      coverImage: catImgUrl.trim() || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
    });
    setCatNameAr('');
    setCatNameEn('');
    setCatImgUrl('');
  };

  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreConfig({
      whatsAppNumber: cfgWhatsApp,
      misNumber: cfgMis,
      storeNameAr: cfgStoreAr,
      storeNameEn: cfgStoreEn,
      facebookUrl: cfgFb,
      tikTokUrl: cfgTt,
      instagramUrl: cfgIg,
      noticeBannerAr: cfgNotice,
      logoUrl: cfgLogoUrl,
      addressAr: cfgAddressAr,
      addressEn: cfgAddressEn,
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[4000] flex items-center justify-center p-2 sm:p-4 overflow-y-auto box-sizing-border-box">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAdminOpen(false)}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Dashboard Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-[95vw] sm:w-full max-w-5xl max-h-[90vh] bg-[#0B1120] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col h-[90vh] box-sizing-border-box text-slate-100"
        >
          {/* Top Admin Navigation Header */}
          <div className="p-3.5 sm:p-5 bg-[#0B1120] border-b border-amber-500/30 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-lg font-bold text-white font-serif flex items-center gap-2 truncate">
                  <span>لوحة تحكم أدمن المعراج 👑</span>
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                  تعديل كافة المنتجات، الأسعار، العروض، الواتساب ورقم MIS بدون كود
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 sm:p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex items-center gap-1.5 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none no-scrollbar">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>إدارة المنتجات ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeTab === 'categories'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>الأقسام والتصنيفات</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeTab === 'slides'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>إدارة السلايدر ({slides.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeTab === 'branding'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>إعدادات المتجر والواتساب</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>تقييمات الزبائن ({reviews.length})</span>
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-950/40">
            {/* TAB 1: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white font-serif">قائمة المنتجات الحالية</h3>
                  <button
                    onClick={() => {
                      setEditingProdId(null);
                      setProdNameAr('');
                      setProdPrice('250');
                      setIsAddingProd(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة قطعة جديدة</span>
                  </button>
                </div>

                {/* Add/Edit Form Modal */}
                {isAddingProd && (
                  <form onSubmit={handleCreateProduct} className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-blue-500/40 space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-sky-400">
                        {editingProdId ? 'تعديل بيانات القطعة' : 'إضافة قطعة ملابس جديدة'}
                      </h4>
                      <button onClick={() => setIsAddingProd(false)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">اسم المنتج بالعين (عربي):</label>
                        <input
                          type="text"
                          required
                          value={prodNameAr}
                          onChange={(e) => setProdNameAr(e.target.value)}
                          placeholder="مثال: بدلة المعراج السوداء الفاخرة"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">السعر (د.ل):</label>
                        <input
                          type="number"
                          required
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">القسم:</label>
                        <select
                          value={prodCatId}
                          onChange={(e) => setProdCatId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <ImageUploader
                          value={prodImgUrl}
                          onChange={setProdImgUrl}
                          label="صورة المنتج (رفع مباشر من الجهاز)"
                          maxSizeMB={5}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">خيار خفاء/عرض السعر للزبائن:</label>
                      <select
                        value={prodDisplayOpt}
                        onChange={(e) => setProdDisplayOpt(e.target.value as PriceOption)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      >
                        <option value="show">إظهار السعر بالدينار الليبي (عادي)</option>
                        <option value="contact_us">استبدال السعر بـ: "تواصل معنا"</option>
                        <option value="ask_price">استبدال السعر بـ: "اسأل عن السعر"</option>
                        <option value="out_of_stock">استبدال السعر بـ: "غير متوفر حالياً"</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-300 pt-2">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodIsFeatured}
                          onChange={(e) => setProdIsFeatured(e.target.checked)}
                        />
                        <span>قطع مميزة (Featured)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prodIsFlashSale}
                          onChange={(e) => setProdIsFlashSale(e.target.checked)}
                        />
                        <span>عرض خاطف (Flash Sale ⚡)</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                    >
                      {editingProdId ? 'حفظ تعديلات القطعة' : 'نشر القطعة بالمتجر الآن'}
                    </button>
                  </form>
                )}

                {/* Table of products */}
                <div className="space-y-2">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className={`p-2.5 sm:p-3 rounded-2xl bg-slate-900 border transition flex items-center justify-between gap-2 ${
                        p.isHidden ? 'opacity-50 border-rose-950' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={p.images[0]} alt={p.nameAr} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{p.nameAr}</h4>
                          <span className="text-[11px] font-extrabold text-sky-400">
                            {p.price} {storeConfig.currencyAr}
                          </span>
                          {p.priceDisplayOption !== 'show' && (
                            <span className="mr-2 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                              {p.priceDisplayOption}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Hide / Show */}
                        <button
                          onClick={() => toggleProductVisibility(p.id)}
                          className={`p-1.5 sm:p-2 rounded-xl text-xs font-bold border transition ${
                            p.isHidden ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                          title={p.isHidden ? 'إظهار المنتج' : 'إخفاء المنتج'}
                        >
                          {p.isHidden ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => startEditProduct(p)}
                          className="p-1.5 sm:p-2 rounded-xl bg-blue-600/20 text-sky-300 border border-blue-500/30 hover:bg-blue-600/40 transition"
                          title="تعديل"
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 sm:p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/40 transition"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: CATEGORIES MANAGEMENT */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <form onSubmit={handleCreateCategory} className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-sky-400">إضافة قسم جديد للمتجر</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">اسم القسم باللغة العربية:</label>
                      <input
                        type="text"
                        required
                        placeholder="اسم القسم (مثال: أزياء السهرة)"
                        value={catNameAr}
                        onChange={(e) => setCatNameAr(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <ImageUploader
                        value={catImgUrl}
                        onChange={setCatImgUrl}
                        label="صورة غلاف القسم (رفع مباشر)"
                        maxSizeMB={5}
                      />
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
                    إضافة القسم
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((c) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={c.coverImage} alt={c.nameAr} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="text-xs font-bold text-white">{c.nameAr}</span>
                      </div>
                      <button onClick={() => deleteCategory(c.id)} className="p-1.5 text-rose-400 hover:bg-slate-800 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SLIDER MANAGEMENT */}
            {activeTab === 'slides' && (
              <div className="space-y-4">
                {/* Header & Add Trigger */}
                <div className="flex items-center justify-between gap-2 p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white font-serif flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-sky-400" />
                      <span>إدارة شرائح السلايدر الرئيسي (Hero Banner)</span>
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                      رفع واستبدال الصور، تعديل العناوين والأوصاف وأزرار الانتقال وإعادة ترتيب الشرائح
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingSlideId(null);
                      setSlideTitleAr('');
                      setSlideTitleEn('');
                      setSlideSubtitleAr('');
                      setSlideSubtitleEn('');
                      setSlideImage('');
                      setSlideBadgeAr('تشكيلة حصرية 2026');
                      setSlideBadgeEn('Exclusive 2026');
                      setSlideCtaTextAr('تصفح الآن');
                      setSlideCtaTextEn('Explore Now');
                      setIsAddingSlide(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة شريحة جديد</span>
                  </button>
                </div>

                {/* Form for Creating / Editing Slide */}
                {isAddingSlide && (
                  <form onSubmit={handleSaveSlide} className="p-4 rounded-2xl bg-slate-900 border border-sky-500/40 space-y-3.5">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>{editingSlideId ? 'تعديل بيانات الشريحة المحددة' : 'إضافة شريحة جديدة للسلايدر'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingSlide(false);
                          setEditingSlideId(null);
                        }}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Upload & Presets */}
                    <div>
                      <ImageUploader
                        value={slideImage}
                        onChange={setSlideImage}
                        label="صورة السلايدر (رفع مباشر من جهازك)"
                        aspectRatioLabel="ينصح بدقة أفقية عالية 16:9"
                        maxSizeMB={5}
                      />

                      {/* Preset Image Options */}
                      <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">أو اختار من معرض الصور الجاهزة:</span>
                        {[
                          { label: 'بدلة رجالية فاخرة', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200' },
                          { label: 'أحذية جلد إيطالي', url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=1200' },
                          { label: 'قمصان وأناقة', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200' },
                          { label: 'إكسسوارات وساعات', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200' },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSlideImage(preset.url)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-sky-300 border border-slate-700 whitespace-nowrap transition"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          العنوان الرئيسي (بالعربي):
                        </label>
                        <input
                          type="text"
                          required
                          value={slideTitleAr}
                          onChange={(e) => setSlideTitleAr(e.target.value)}
                          placeholder="مثال: تشكيلة البدلات الإيطالية الفاخرة"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          العنوان الرئيسي (بالإنجليزي):
                        </label>
                        <input
                          type="text"
                          value={slideTitleEn}
                          onChange={(e) => setSlideTitleEn(e.target.value)}
                          placeholder="e.g. Italian Royal Suits Collection"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Subtitles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          الوصف الفرعي (بالعربي):
                        </label>
                        <textarea
                          rows={2}
                          value={slideSubtitleAr}
                          onChange={(e) => setSlideSubtitleAr(e.target.value)}
                          placeholder="مثال: خصومات حصرية واستلام مباشر من فرعنا الرئيسي"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          الوصف الفرعي (بالإنجليزي):
                        </label>
                        <textarea
                          rows={2}
                          value={slideSubtitleEn}
                          onChange={(e) => setSlideSubtitleEn(e.target.value)}
                          placeholder="e.g. Exclusive offers with direct in-store pickup"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Badge, CTA, and Category Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          الشارة / الوسام العلوي:
                        </label>
                        <input
                          type="text"
                          value={slideBadgeAr}
                          onChange={(e) => setSlideBadgeAr(e.target.value)}
                          placeholder="مثال: عروض خاصة ⚡"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          نص الزر (عربي):
                        </label>
                        <input
                          type="text"
                          value={slideCtaTextAr}
                          onChange={(e) => setSlideCtaTextAr(e.target.value)}
                          placeholder="مثال: تسوق التشكيلة"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          رابط الزر / القسم المرتبط:
                        </label>
                        <select
                          value={slideLinkCatId}
                          onChange={(e) => setSlideLinkCatId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                        >
                          <option value="all">جميع القطع والمنتجات</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                      >
                        {editingSlideId ? 'حفظ تعديلات الشريحة' : 'نشر الشريحة بالصفحة الرئيسية'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingSlide(false);
                          setEditingSlideId(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                )}

                {/* Slides List */}
                <div className="space-y-3">
                  {slides.map((s, index) => (
                    <div
                      key={s.id}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-blue-900/50 transition"
                    >
                      {/* Order Index & Thumbnail & Details */}
                      <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                        <span className="w-7 h-7 rounded-xl bg-slate-800 text-sky-400 font-extrabold text-xs flex items-center justify-center border border-slate-700 flex-shrink-0">
                          #{index + 1}
                        </span>

                        <img
                          src={s.image}
                          alt={s.titleAr}
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 sm:w-20 sm:h-14 rounded-xl object-cover border border-slate-800 bg-slate-950 flex-shrink-0"
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-white font-serif truncate">{s.titleAr}</h4>
                            {s.badgeAr && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-sky-300 text-[9px] font-bold border border-blue-500/30">
                                {s.badgeAr}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-light">{s.subtitleAr}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                            <span className="text-sky-400 font-bold">الزر: {s.ctaTextAr}</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                        <button
                          onClick={() => handleMoveSlideUp(index)}
                          disabled={index === 0}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                          title="تحريك لأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleMoveSlideDown(index)}
                          disabled={index === slides.length - 1}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                          title="تحريك لأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => startEditSlide(s)}
                          className="p-2 rounded-xl bg-blue-600/20 text-sky-300 border border-blue-500/30 hover:bg-blue-600/40 transition"
                          title="تعديل الشريحة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            deleteSlide(s.id);
                            addToast(
                              'info',
                              language === 'ar' ? 'تم حذف الشريحة' : 'Slide Deleted',
                              language === 'ar' ? 'تم حذف الشريحة من السلايدر بنجاح' : 'Slide removed from hero slider'
                            );
                          }}
                          className="p-2 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/40 transition"
                          title="حذف الشريحة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BRANDING & STORE CONFIG */}
            {activeTab === 'branding' && (
              <form onSubmit={handleSaveStoreConfig} className="max-w-2xl mx-auto space-y-4">
                {/* LOGO CUSTOMIZATION SECTION */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-sky-400 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-400" />
                      <span>تغيير الشعار (Logo)</span>
                    </h4>
                    {cfgLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setCfgLogoUrl('')}
                        className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>استعادة الشعار الافتراضي</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    يمكنك تغيير شعار المتجر برفع صورة جديدة من جهازك بصيغة (PNG, JPG, JPEG, WebP) أو إدخال رابط الصورة مباشرة. سيتغير الشعار تلقائياً فور الحفظ.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    {/* Preview Area */}
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">معاينة الشعار الحالية</span>
                      <div className="p-3 bg-slate-900/90 rounded-2xl border border-blue-500/30 shadow-lg flex items-center justify-center">
                        <Logo logoUrl={cfgLogoUrl} size="lg" showText={false} />
                      </div>
                      <span className="text-[11px] text-sky-300 font-semibold mt-1">
                        {cfgLogoUrl ? 'شعار مخصص (مرفوع من اللوحة)' : 'الشعار الافتراضي للمتجر'}
                      </span>
                    </div>

                    {/* Upload Controls */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1.5">رفع صورة جديدة من الجهاز:</label>
                        <input
                          type="file"
                          ref={logoFileInputRef}
                          onChange={handleLogoFileUpload}
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          className="w-full py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-sky-300 border border-blue-500/40 font-bold text-xs flex items-center justify-center gap-2 transition"
                        >
                          <Upload className="w-4 h-4 text-sky-400" />
                          <span>رفع صورة الشعار (PNG, JPG, WebP)</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">أو إدخال رابط الصورة مباشرة:</label>
                        <input
                          type="text"
                          value={cfgLogoUrl}
                          onChange={(e) => setCfgLogoUrl(e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white dir-ltr"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>رقم الواتساب ورقم المنظومة MIS الخاص بالمتجر</span>
                  </h4>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      رقم الهاتف لاستقبال طلبات الواتساب الفورية (بدون +):
                    </label>
                    <input
                      type="text"
                      value={cfgWhatsApp}
                      onChange={(e) => setCfgWhatsApp(e.target.value)}
                      placeholder="218917008899"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">رقم منظومة MIS الخاص بالمتجر:</label>
                    <input
                      type="text"
                      value={cfgMis}
                      onChange={(e) => setCfgMis(e.target.value)}
                      placeholder="MIS-778291"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-sky-400 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>روابط التواصل الاجتماعي والتنبيهات</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="رابط فيسبوك"
                      value={cfgFb}
                      onChange={(e) => setCfgFb(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="رابط تيك توك"
                      value={cfgTt}
                      onChange={(e) => setCfgTt(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="رابط انستغرام"
                      value={cfgIg}
                      onChange={(e) => setCfgIg(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">شريط الإعلانات أعلى الصفحة:</label>
                    <input
                      type="text"
                      value={cfgNotice}
                      onChange={(e) => setCfgNotice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">عنوان المتجر بالعربية (يظهر في ترويسة وتذييل الموقع وتأكيد الطلبات):</label>
                    <input
                      type="text"
                      value={cfgAddressAr}
                      onChange={(e) => setCfgAddressAr(e.target.value)}
                      placeholder="بني وليد - شارع القوايده..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xl flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ إعدادات الأدمن بالكامل</span>
                </button>
              </form>
            )}

            {/* TAB 4: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {rev.userName} ({rev.userCity})
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">{rev.commentAr}</p>
                    </div>
                    <button onClick={() => deleteReview(rev.id)} className="p-2 text-rose-400 hover:bg-slate-800 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
