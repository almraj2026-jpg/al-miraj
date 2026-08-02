import React from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Globe,
  ArrowUp,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { storeConfig, language, setIsAccountOpen, setIsAdminOpen } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#070B14] border-t border-blue-900/40 text-slate-400 text-xs pt-12 pb-24 md:pb-12 select-none relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Col 1: Brand & Slogan */}
        <div className="space-y-4">
          <Logo
            variant="header"
            size="lg"
            storeNameAr={storeConfig.storeNameAr}
            storeNameEn={storeConfig.storeNameEn}
          />

          <p className="text-xs text-slate-300 font-light leading-relaxed">
            {language === 'ar' ? storeConfig.sloganAr : storeConfig.sloganEn}
          </p>
        </div>

        {/* Col 2: Customer Support & Policies */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white font-serif">
            {language === 'ar' ? 'خدمة الزبائن والسياسات' : 'Policies & Support'}
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'سياسة الاستبدال والاسترجاع' : 'Return & Exchange Policy'}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>{language === 'ar' ? storeConfig.addressAr : storeConfig.addressEn}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{storeConfig.phoneCallNumber}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{storeConfig.email}</span>
            </li>
          </ul>
        </div>

        {/* Col 3: WhatsApp Direct Connect & Social Media */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white font-serif">{language === 'ar' ? 'تواصل معنا مباشرة' : 'Connect With Us'}</h4>

          <a
            href={`https://wa.me/${storeConfig.whatsAppNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition border border-emerald-400/30"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{language === 'ar' ? 'محادثة المتجر عبر الواتساب' : 'Store WhatsApp Chat'}</span>
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {storeConfig.facebookUrl && (
              <a
                href={storeConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 font-bold hover:bg-slate-800 transition"
              >
                Facebook
              </a>
            )}
            {storeConfig.tikTokUrl && (
              <a
                href={storeConfig.tikTokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-300 font-bold hover:bg-slate-800 transition"
              >
                TikTok
              </a>
            )}
            {storeConfig.instagramUrl && (
              <a
                href={storeConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 font-bold hover:bg-slate-800 transition"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Admin trigger */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          © 2026 {storeConfig.storeNameAr} (Al-Miraj). جميع الحقوق محفوظة لمتجر الأزياء الملكية بليبيا.
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsAdminOpen(true)} className="hover:text-amber-400 transition">
            {language === 'ar' ? 'لوحة تحكم الأدمن' : 'Admin Panel'}
          </button>
          <span>•</span>
          <button onClick={scrollToTop} className="flex items-center gap-1 hover:text-white transition">
            <span>{language === 'ar' ? 'للأعلى' : 'Scroll Top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
