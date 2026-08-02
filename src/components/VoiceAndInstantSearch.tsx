import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Mic, X, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const VoiceAndInstantSearch: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    language,
    categories,
    setActiveCategory,
  } = useStore();

  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isListening, setIsListening] = useState(false);

  if (!isSearchOpen) return null;

  // Filter logic
  let results = products.filter((p) => !p.isHidden);
  if (selectedCat !== 'all') {
    results = results.filter((p) => p.categoryId === selectedCat);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.descriptionAr.toLowerCase().includes(q) ||
        p.descriptionEn.toLowerCase().includes(q)
    );
  }

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(
        language === 'ar'
          ? 'عذراً، متصفحك لا يدعم خاصية البحث الصوتي المباشر'
          : 'Voice search is not supported in this browser'
      );
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ar' ? 'ar-LY' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setQuery(text);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto box-sizing-border-box">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Centered Modal (90% width, max 450px) */}
      <div className="relative z-10 w-[90vw] max-w-[450px] max-h-[90vh] overflow-y-auto bg-[#0B1120] rounded-3xl border border-blue-500/30 p-4 sm:p-5 shadow-2xl my-auto box-sizing-border-box text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white font-serif">
              {language === 'ar' ? 'البحث الذكي الفوري' : 'Instant Search'}
            </h3>
          </div>

          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input & Voice Button */}
        <div className="relative mb-3">
          <input
            type="text"
            autoFocus
            placeholder={
              language === 'ar'
                ? 'ابحث باسم القطعة، الخامة، البدلات، الأحذية...'
                : 'Search suits, shoes, accessories...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 rtl:pr-10 rtl:pl-10 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 rtl:right-3 rtl:left-auto top-3.5" />

          <button
            onClick={handleVoiceSearch}
            className={`absolute right-3 rtl:left-3 rtl:right-auto top-2.5 p-1.5 rounded-xl border transition ${
              isListening
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'bg-slate-800 text-sky-400 border-slate-700/50 hover:bg-slate-700'
            }`}
            title="البحث الصوتي"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Categories Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 no-scrollbar scrollbar-none">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition border ${
              selectedCat === 'all'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {language === 'ar' ? 'جميع الأقسام' : 'All'}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition border ${
                selectedCat === c.id
                  ? 'bg-blue-600 text-white border-blue-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {language === 'ar' ? c.nameAr : c.nameEn}
            </button>
          ))}
        </div>

        {/* Search Results Grid */}
        <div className="max-h-[350px] overflow-y-auto space-y-2">
          {results.length === 0 ? (
            <div className="text-center py-8 bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-300">
                {language === 'ar' ? 'لم يتم العثور على قطع مطابقة للبحث' : 'No matching results found'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
