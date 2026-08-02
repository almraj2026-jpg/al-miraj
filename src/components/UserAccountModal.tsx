import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User,
  Heart,
  ShoppingBag,
  History,
  Shield,
  LogOut,
  Mail,
  Phone,
  Lock,
  Edit2,
  CheckCircle,
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export const UserAccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    userProfile,
    setUserProfile,
    wishlist,
    products,
    language,
    storeConfig,
    setIsAdminOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'wishlist' | 'orders'>('wishlist');
  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');

  if (!isAccountOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        name,
        email,
        phone,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto box-sizing-border-box">
      {/* Backdrop */}
      <div
        onClick={() => setIsAccountOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Centered Modal (90% width, max 450px) */}
      <div className="relative z-10 w-[90vw] max-w-[450px] max-h-[90vh] overflow-y-auto bg-[#0B1120] rounded-3xl border border-blue-500/30 p-4 sm:p-6 shadow-2xl my-auto box-sizing-border-box text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600/20 text-sky-400 border border-blue-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">
                {language === 'ar' ? 'حسابي الشخصي' : 'My Account'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {userProfile?.name ? userProfile.name : language === 'ar' ? 'زبون المعراج المميز' : 'Valued Customer'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition ${
              activeTab === 'wishlist' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'المفضلة' : 'Wishlist'}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition ${
              activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'طلباتي' : 'Orders'}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'بياناتي' : 'Profile'}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="text-center py-8 bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
                <Heart className="w-8 h-8 text-rose-500/40 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-300">
                  {language === 'ar' ? 'لا توجد قطع في قائمة المفضلة' : 'No items in wishlist'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {language === 'ar' ? 'اضغط على قلب المفضلة بأي قطعة لإضافتها هنا' : 'Click the heart icon on any product to add it here'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 max-h-[350px] overflow-y-auto p-1">
                {wishlistedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="font-bold text-white">#ALM-2026-884</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {language === 'ar' ? 'تم الاستلام من المحل' : 'Picked Up at Store'}
                </span>
              </div>
              <p className="text-slate-300 font-medium">بدلة رسمية فاخرة (Italian Slim Fit)</p>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                <span>{language === 'ar' ? 'استلام الفرع الرئيسي' : 'Main Branch Pickup'}</span>
                <span className="font-bold text-sky-400">650 {storeConfig.currencyAr}</span>
              </div>
            </div>

            {userProfile?.role === 'admin' && (
              <button
                onClick={() => {
                  setIsAccountOpen(false);
                  setIsAdminOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center justify-center gap-2 transition"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'الانتقال إلى لوحة تحكم الأدمن' : 'Open Admin Dashboard'}</span>
              </button>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                {language === 'ar' ? 'الاسم:' : 'Name:'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                {language === 'ar' ? 'رقم الهاتف:' : 'Phone:'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition border border-blue-400/30 mt-2"
            >
              {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
