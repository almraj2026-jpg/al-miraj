import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { SlidersHorizontal, Grid, LayoutList, Sparkles } from 'lucide-react';

interface ProductGridProps {
  onSelectProduct?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct }) => {
  const { products, activeCategory, language } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  // Filter products by category
  let filtered = products.filter((p) => !p.isHidden);
  if (activeCategory !== 'all') {
    filtered = filtered.filter((p) => p.categoryId === activeCategory);
  }

  // Sort
  if (sortBy === 'price_low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <section id="products-section" className="w-full max-w-7xl mx-auto px-4 py-8 select-none">
      {/* Title and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
            <span>
              {activeCategory === 'all'
                ? language === 'ar'
                  ? 'جميع التشكيلات والمنتجات'
                  : 'All Luxury Products'
                : language === 'ar'
                ? 'تشكيلة القسم المSelected'
                : 'Selected Collection'}
            </span>
          </h2>
          <span className="text-xs text-slate-400 mt-0.5 block">
            {language === 'ar' ? `عرض ${filtered.length} قطعة متوفرة` : `Showing ${filtered.length} items`}
          </span>
        </div>

        {/* View mode & Sort controls */}
        <div className="flex items-center gap-2.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="featured">{language === 'ar' ? 'القطع المميزة' : 'Featured'}</option>
            <option value="price_low">{language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
            <option value="price_high">{language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
            <option value="rating">{language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800">
          <p className="text-sm font-bold text-slate-300">
            {language === 'ar' ? 'لا توجد قطع متوفرة في هذا القسم حالياً' : 'No products available in this section'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onOpenDetail={onSelectProduct} />
          ))}
        </div>
      )}
    </section>
  );
};
