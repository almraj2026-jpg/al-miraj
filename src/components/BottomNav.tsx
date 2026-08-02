import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Home,
  Grid,
  Heart,
  ShoppingBag,
  User,
  Shield,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    language,
    cart,
    wishlist,
    setIsCartOpen,
    setIsAccountOpen,
    setIsAdminOpen,
    userProfile,
    activeCategory,
    setActiveCategory,
  } = useStore();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToCategories = () => {
    setActiveCategory('all');
    const el = document.getElementById('categories-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHome = () => {
    setActiveCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B1120]/95 backdrop-blur-xl border-t border-blue-900/40 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={scrollToHome}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition ${
            activeCategory === 'all' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* Categories */}
        <button
          onClick={scrollToCategories}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">{language === 'ar' ? 'الأقسام' : 'Categories'}</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsAccountOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 relative transition"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-rose-400" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0B1120]">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px]">{language === 'ar' ? 'المفضلة' : 'Wishlist'}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 relative transition"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#0B1120]">
                {totalCartItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">{language === 'ar' ? 'السلة' : 'Cart'}</span>
        </button>

        {/* Account or Admin */}
        <button
          onClick={() => (userProfile?.role === 'admin' ? setIsAdminOpen(true) : setIsAccountOpen(true))}
          className="flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition"
        >
          {userProfile?.role === 'admin' ? (
            <Shield className="w-5 h-5 text-amber-400" />
          ) : (
            <User className="w-5 h-5 text-slate-300" />
          )}
          <span className="text-[10px]">
            {userProfile?.role === 'admin' ? (language === 'ar' ? 'الأدمن' : 'Admin') : language === 'ar' ? 'حسابي' : 'Account'}
          </span>
        </button>
      </div>
    </div>
  );
};
