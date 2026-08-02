import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Quote, CheckCircle2, ThumbsUp } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, language } = useStore();

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 select-none">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-sky-400 text-xs font-bold border border-blue-500/30 mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{language === 'ar' ? 'ثقة زبائننا في ليبيا' : 'Customer Reviews'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
          {language === 'ar' ? 'ماذا يقول زبائن المعراج؟' : 'What Our Clients Say'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {language === 'ar'
            ? 'تجارب حقيقية لزبائننا في طرابلس، بنغازي، مصراتة، والزاوية'
            : 'Genuine experiences from customers across Libyan cities'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.slice(0, 4).map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition relative group"
          >
            <Quote className="absolute top-4 left-4 rtl:right-4 rtl:left-auto w-8 h-8 text-blue-600/10 group-hover:text-blue-500/20 transition" />

            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                  />
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-light mb-4 italic">
                "{language === 'ar' ? rev.commentAr : rev.commentEn}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{rev.userName}</span>
                  {rev.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                </h4>
                <span className="text-[10px] text-slate-500">{rev.userCity}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
