import React from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Shield,
  Globe,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    storeConfig,
    cart,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    setIsAccountOpen,
    setIsAdminOpen,
    setIsAiStylistOpen,
    userProfile,
  } = useStore();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full max-w-full bg-[#0B1120]/95 dark:bg-[#0B1120]/95 bg-slate-900/95 backdrop-blur-md border-b border-blue-900/30 transition-colors box-sizing-border-box">
      {/* Top Announcement Bar */}
      {storeConfig.showNoticeBanner && (
        <div className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-800 text-white text-[10px] sm:text-[11px] font-medium py-1 px-2 sm:px-4 text-center overflow-hidden flex items-center justify-center gap-1.5 border-b border-blue-400/20">
          <Sparkles className="w-3 h-3 flex-shrink-0 animate-pulse text-amber-300" />
          <span className="truncate max-w-xs sm:max-w-md md:max-w-xl">
            {language === 'ar' ? storeConfig.noticeBannerAr : storeConfig.noticeBannerEn}
          </span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center justify-between gap-1 sm:gap-3 box-sizing-border-box overflow-hidden">
        {/* Left Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 text-[11px] sm:text-xs font-medium transition flex-shrink-0"
            title="تغيير اللغة / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span className="leading-none">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700/50 transition flex-shrink-0"
            title="المظهر الداكن/الفاتح"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>

          {/* AI Stylist Assistant Button */}
          <button
            onClick={() => setIsAiStylistOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-[11px] sm:text-xs font-bold shadow-lg shadow-blue-600/20 hover:opacity-90 transition border border-blue-400/30 flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin flex-shrink-0" style={{ animationDuration: '4s' }} />
            <span className="whitespace-nowrap">{language === 'ar' ? 'مستشار الموضة AI' : 'AI Stylist'}</span>
          </button>
        </div>

        {/* Center Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="cursor-pointer transition transform hover:scale-105 flex-shrink min-w-0 mx-1"
        >
          <Logo
            variant="header"
            size="md"
            storeNameAr={storeConfig.storeNameAr}
            storeNameEn={storeConfig.storeNameEn}
          />
        </button>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Instant & Voice Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/50 transition relative group flex-shrink-0"
            aria-label="البحث"
          >
            <Search className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/50 transition relative flex-shrink-0"
            aria-label="المفضلة"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0B1120]">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-lg shadow-blue-600/30 transition relative border border-blue-400/30 flex-shrink-0"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0B1120]">
                {totalCartItems}
              </span>
            )}
          </button>

          {/* Account / Admin Trigger */}
          <button
            onClick={() => (userProfile?.role === 'admin' ? setIsAdminOpen(true) : setIsAccountOpen(true))}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/50 transition flex-shrink-0"
            title={userProfile?.role === 'admin' ? 'لوحة التحكم Admin' : 'حسابي Account'}
          >
            {userProfile?.role === 'admin' ? (
              <Shield className="w-4 h-4 text-amber-400" />
            ) : (
              <User className="w-4 h-4 text-blue-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
