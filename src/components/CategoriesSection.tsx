import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  UserCheck,
  Sparkles,
  Footprints,
  Watch,
  Flame,
  Tag,
  Grid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const { categories, activeCategory, setActiveCategory, language } = useStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-4 h-4" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" />;
      case 'Footprints':
        return <Footprints className="w-4 h-4" />;
      case 'Watch':
        return <Watch className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Tag':
        return <Tag className="w-4 h-4" />;
      default:
        return <Grid className="w-4 h-4" />;
    }
  };

  return (
    <section id="categories-section" className="w-full max-w-7xl mx-auto px-4 py-6 select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
            <span>{language === 'ar' ? 'تشكيلات المعراج' : 'Explore Categories'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar' ? 'انتقاء مميز لكافة الأذواق والمناسبات' : 'Select from curated luxury collections'}
          </p>
        </div>

        <button
          onClick={() => setActiveCategory('all')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:text-white'
          }`}
        >
          {language === 'ar' ? 'جميع القطع' : 'Show All'}
        </button>
      </div>

      {/* Horizontal Scrollable Category Pills for Quick Filtering */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white border-blue-400/40 shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Grid className="w-4 h-4 text-sky-400" />
          <span>{language === 'ar' ? 'الكل' : 'All Products'}</span>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white border-blue-400/40 shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-sky-400'}>{getIcon(cat.icon)}</span>
              <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Category Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-600/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Image with referrerPolicy */}
              <img
                src={cat.coverImage}
                alt={language === 'ar' ? cat.nameAr : cat.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <div className="flex items-center gap-1.5 text-sky-400 mb-0.5">
                  {getIcon(cat.icon)}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {cat.itemCount ? `${cat.itemCount} ${language === 'ar' ? 'قطعة' : 'items'}` : ''}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
