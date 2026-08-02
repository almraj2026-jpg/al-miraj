import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SLIDES,
  INITIAL_STORE_CONFIG,
} from '../data/initialData';
import {
  CartItem,
  Category,
  Language,
  Order,
  PriceOption,
  Product,
  ProductColor,
  Review,
  SliderSlide,
  StoreConfig,
  ThemeMode,
  ToastMessage,
  UserProfile,
} from '../types';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  storeConfig: StoreConfig;
  updateStoreConfig: (config: Partial<StoreConfig>) => void;
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductVisibility: (id: string) => void;
  setProductPriceOption: (id: string, option: PriceOption) => void;
  
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  slides: SliderSlide[];
  addSlide: (slide: Omit<SliderSlide, 'id'>) => void;
  updateSlide: (id: string, slide: Partial<SliderSlide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlides: (newSlides: SliderSlide[]) => void;
  
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'isVerified'>) => void;
  deleteReview: (id: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product, selectedColor?: ProductColor, selectedSize?: string, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateCartQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; percent: number } | null;
  applyCoupon: (code: string) => boolean;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>) => Order;
  
  userProfile: UserProfile | null;
  setUserProfile: (user: UserProfile | null) => void;
  isAdmin: boolean;
  
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isAiStylistOpen: boolean;
  setIsAiStylistOpen: (open: boolean) => void;
  
  activeCategory: string; // 'all' or category ID
  setActiveCategory: (catId: string) => void;
  
  splashActive: boolean;
  dismissSplash: () => void;
  
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Splash Screen State
  const [splashActive, setSplashActive] = useState<boolean>(true);

  // Language & RTL State
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('almiraj_lang') as Language) || 'ar';
  });

  // Theme State
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('almiraj_theme') as ThemeMode) || 'dark';
  });

  // Store Configuration
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('almiraj_store_config');
    if (!saved) return INITIAL_STORE_CONFIG;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.addressAr && parsed.addressAr.includes('طرابلس')) {
        parsed.addressAr = INITIAL_STORE_CONFIG.addressAr;
        parsed.addressEn = INITIAL_STORE_CONFIG.addressEn;
      }
      if (parsed.noticeBannerAr && parsed.noticeBannerAr.includes('طرابلس')) {
        parsed.noticeBannerAr = INITIAL_STORE_CONFIG.noticeBannerAr;
        parsed.noticeBannerEn = INITIAL_STORE_CONFIG.noticeBannerEn;
      }
      return parsed;
    } catch {
      return INITIAL_STORE_CONFIG;
    }
  });

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('almiraj_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('almiraj_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Hero Slides
  const [slides, setSlides] = useState<SliderSlide[]>(() => {
    const saved = localStorage.getItem('almiraj_slides');
    return saved ? JSON.parse(saved) : INITIAL_SLIDES;
  });

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('almiraj_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('almiraj_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Applied Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);

  // Wishlist Product IDs
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('almiraj_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('almiraj_recent');
    return saved ? JSON.parse(saved) : [];
  });

  // Saved Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('almiraj_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // User Profile
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('almiraj_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals / Panels
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState<boolean>(false);

  // Filters State
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Synchronize Language and RTL Attributes on Document Root
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('almiraj_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Synchronize Dark / Light Mode Class on Document Root
  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('almiraj_theme', mode);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('almiraj_store_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  useEffect(() => {
    localStorage.setItem('almiraj_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('almiraj_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('almiraj_slides', JSON.stringify(slides));
  }, [slides]);

  useEffect(() => {
    localStorage.setItem('almiraj_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('almiraj_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('almiraj_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('almiraj_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('almiraj_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('almiraj_user', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('almiraj_user');
    }
  }, [userProfile]);

  // Toast Helpers
  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product CRUD
  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...p,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast('success', language === 'ar' ? 'تمت الإضافة' : 'Product Added', language === 'ar' ? `تم إضافة "${p.nameAr}" بنجاح` : `Added "${p.nameEn}" successfully`);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    addToast('success', language === 'ar' ? 'تم التحديث' : 'Product Updated', language === 'ar' ? 'تم تحديث بيانات المنتج بنجاح' : 'Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    addToast('info', language === 'ar' ? 'تم الحذف' : 'Product Deleted', language === 'ar' ? 'تم حذف المنتج من المتجر' : 'Product removed from store');
  };

  const toggleProductVisibility = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isHidden = !item.isHidden;
          addToast(
            'info',
            language === 'ar' ? 'الحالة' : 'Visibility Changed',
            isHidden
              ? language === 'ar' ? 'تم إخفاء المنتج' : 'Product hidden'
              : language === 'ar' ? 'المنتج ظاهر الآن للزبائن' : 'Product is now visible'
          );
          return { ...item, isHidden };
        }
        return item;
      })
    );
  };

  const setProductPriceOption = (id: string, option: PriceOption) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, priceDisplayOption: option } : item))
    );
  };

  // Category CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: 'cat-' + Date.now() };
    setCategories((prev) => [...prev, newCat]);
    addToast('success', language === 'ar' ? 'تم إضافة قسم' : 'Category Added', cat.nameAr);
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setCategories((prev) => prev.map((item) => (item.id === id ? { ...item, ...cat } : item)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  // Slider CRUD
  const addSlide = (slide: Omit<SliderSlide, 'id'>) => {
    const newSlide: SliderSlide = { ...slide, id: 'slide-' + Date.now() };
    setSlides((prev) => [...prev, newSlide]);
  };

  const updateSlide = (id: string, slide: Partial<SliderSlide>) => {
    setSlides((prev) => prev.map((item) => (item.id === id ? { ...item, ...slide } : item)));
  };

  const deleteSlide = (id: string) => {
    setSlides((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderSlides = (newSlides: SliderSlide[]) => {
    setSlides(newSlides);
  };

  // Review CRUD
  const addReview = (r: Omit<Review, 'id' | 'date' | 'isVerified'>) => {
    const newRev: Review = {
      ...r,
      id: 'rev-' + Date.now(),
      date: language === 'ar' ? 'الآن' : 'Just now',
      isVerified: true,
    };
    setReviews((prev) => [newRev, ...prev]);
    addToast('success', language === 'ar' ? 'شكراً لتقييمك!' : 'Thank you!', language === 'ar' ? 'تم إضافة تقييمك بنجاح' : 'Review added successfully');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((item) => item.id !== id));
  };

  // Store Config Update
  const updateStoreConfig = (newConfig: Partial<StoreConfig>) => {
    setStoreConfig((prev) => ({ ...prev, ...newConfig }));
    addToast('success', language === 'ar' ? 'تم حفظ الإعدادات' : 'Settings Saved', language === 'ar' ? 'تم تحديث بيانات المتجر والعلامة التجارية' : 'Store configuration updated');
  };

  // Cart Operations
  const addToCart = (
    product: Product,
    selectedColor?: ProductColor,
    selectedSize?: string,
    quantity: number = 1
  ) => {
    const color = selectedColor || product.colors[0] || { nameAr: 'افتراضي', nameEn: 'Default', hex: '#2563EB' };
    const size = selectedSize || product.sizes[0] || 'Standard';

    const cartId = `${product.id}-${color.hex}-${size}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartId === cartId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartId,
            product,
            selectedColor: color,
            selectedSize: size,
            quantity,
          },
        ];
      }
    });

    addToast(
      'success',
      language === 'ar' ? 'أضيف للسلة 🛒' : 'Added to Cart 🛒',
      language === 'ar' ? `تم إضافة "${product.nameAr}" إلى سلة المشتريات` : `Added "${product.nameEn}" to cart`
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'MIRAJ10' || cleanCode === 'المعراج10') {
      setAppliedCoupon({ code: cleanCode, percent: 10 });
      addToast('success', language === 'ar' ? 'تم تطبيق الخصم 🎉' : 'Coupon Applied 🎉', language === 'ar' ? 'حصلت على خصم 10% على إجمالي السلة' : 'Enjoy 10% off your order');
      return true;
    } else if (cleanCode === 'MIRAJ20' || cleanCode === 'المعراج20') {
      setAppliedCoupon({ code: cleanCode, percent: 20 });
      addToast('success', language === 'ar' ? 'كوبون مميز ⚡' : 'Special Coupon ⚡', language === 'ar' ? 'خصم 20% لكافة المشتريات' : '20% off applied');
      return true;
    } else {
      addToast('error', language === 'ar' ? 'كوبون غير صالح' : 'Invalid Coupon', language === 'ar' ? 'تأكد من رمز الكوبون أو جرب MIRAJ10' : 'Check code or try MIRAJ10');
      return false;
    }
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('info', language === 'ar' ? 'المفضلة' : 'Wishlist', language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('success', language === 'ar' ? 'المفضلة ❤️' : 'Wishlist ❤️', language === 'ar' ? 'تمت الإضافة إلى القائمة المفضلة' : 'Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Recently Viewed
  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 10));
  };

  // Orders creation
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>): Order => {
    const orderNumber = 'MRJ-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber,
      date: new Date().toLocaleDateString('ar-LY', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'pending_whatsapp',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Dismiss Splash Screen
  const dismissSplash = () => {
    setSplashActive(false);
  };

  // Reset Storage to Factory Defaults
  const resetToDefaults = () => {
    localStorage.clear();
    setStoreConfig(INITIAL_STORE_CONFIG);
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setSlides(INITIAL_SLIDES);
    setReviews(INITIAL_REVIEWS);
    setCart([]);
    setWishlist([]);
    setRecentlyViewed([]);
    setOrders([]);
    setUserProfileState(null);
    addToast('info', language === 'ar' ? 'إعادة ضبط' : 'Factory Reset', language === 'ar' ? 'تمت إعادة ضبط المتجر إلى البيانات الافتراضية' : 'Reset store data to default');
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
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
        updateCategory,
        deleteCategory,
        slides,
        addSlide,
        updateSlide,
        deleteSlide,
        reorderSlides,
        reviews,
        addReview,
        deleteReview,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        recentlyViewed,
        addRecentlyViewed,
        orders,
        createOrder,
        userProfile,
        setUserProfile: setUserProfileState,
        isAdmin: userProfile?.role === 'admin',
        toasts,
        addToast,
        removeToast,
        quickViewProduct,
        setQuickViewProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAccountOpen,
        setIsAccountOpen,
        isAiStylistOpen,
        setIsAiStylistOpen,
        activeCategory,
        setActiveCategory,
        splashActive,
        dismissSplash,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
