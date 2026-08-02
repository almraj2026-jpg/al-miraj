export type Language = 'ar' | 'en';
export type ThemeMode = 'dark' | 'light';

export type BadgeType = 'new' | 'sale' | 'best_seller' | 'featured' | 'hot';
export type PriceOption = 'show' | 'contact_us' | 'ask_price' | 'out_of_stock';

export interface ProductColor {
  nameAr: string;
  nameEn: string;
  hex: string;
}

export interface Specification {
  keyAr: string;
  keyEn: string;
  valAr: string;
  valEn: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryId: string;
  price: number; // in LYD (د.ل)
  oldPrice?: number;
  priceDisplayOption: PriceOption;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  isHot: boolean;
  isFlashSale: boolean;
  isBestSeller: boolean;
  isHidden: boolean;
  discountPercent?: number;
  specifications?: Specification[];
  createdAt: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string; // Lucide icon identifier
  coverImage: string;
  descriptionAr?: string;
  descriptionEn?: string;
  itemCount?: number;
}

export interface SliderSlide {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  image: string;
  badgeAr?: string;
  badgeEn?: string;
  linkCategoryId?: string;
  ctaTextAr: string;
  ctaTextEn: string;
}

export interface Review {
  id: string;
  userName: string;
  userCity: string;
  rating: number;
  commentAr: string;
  commentEn: string;
  date: string;
  isVerified: boolean;
  productName?: string;
  userAvatar?: string;
}

export interface StoreConfig {
  storeNameAr: string;
  storeNameEn: string;
  sloganAr: string;
  sloganEn: string;
  logoUrl?: string; // If empty or set, can render custom luxury SVG or custom image
  useCustomLogoSvg: boolean;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  whatsAppNumber: string; // e.g. "218912345678"
  misNumber: string; // e.g. "MIS-887410"
  facebookUrl: string;
  tikTokUrl: string;
  instagramUrl: string;
  email: string;
  phoneCallNumber: string;
  businessHoursAr: string;
  businessHoursEn: string;
  addressAr: string;
  addressEn: string;
  currencyAr: string; // "د.ل"
  currencyEn: string; // "LYD"
  freeShippingThreshold: number; // e.g. 200 LYD
  shippingCostTripoli: number; // e.g. 10 LYD
  shippingCostOtherCities: number; // e.g. 20 LYD
  noticeBannerAr?: string;
  noticeBannerEn?: string;
  showNoticeBanner: boolean;
}

export interface CartItem {
  cartId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  colorName: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  phoneNumber: string;
  city: string;
  address: string;
  misNumber: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'pending_whatsapp' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  misNumber?: string;
  role: 'customer' | 'admin';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface SearchFilters {
  query: string;
  categoryId: string;
  minPrice: number;
  maxPrice: number;
  onlyDiscounted: boolean;
  onlyInStock: boolean;
  onlyNew: boolean;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'rating' | 'newest';
}
