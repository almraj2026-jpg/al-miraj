import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { SplashLoading } from './components/SplashLoading';
import { ToastContainer } from './components/ToastContainer';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoriesSection } from './components/CategoriesSection';
import { FlashSaleSection } from './components/FlashSaleSection';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { VoiceAndInstantSearch } from './components/VoiceAndInstantSearch';
import { AiStylistModal } from './components/AiStylistModal';
import { UserAccountModal } from './components/UserAccountModal';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { FloatingStickyCart } from './components/FloatingStickyCart';

const MainAppContent: React.FC = () => {
  const { selectedProduct, setSelectedProduct } = useStore();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative box-sizing-border-box">
      <SplashLoading />
      <ToastContainer />

      {/* Sticky Top Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-20 md:pb-0 box-sizing-border-box">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        ) : (
          <>
            {/* Hero Slider */}
            <HeroSlider />

            {/* Main Categories Navigation */}
            <CategoriesSection />

            {/* Flash Sale Banner */}
            <FlashSaleSection />

            {/* Products Section */}
            <ProductGrid onSelectProduct={(p) => setSelectedProduct(p)} />

            {/* Customer Reviews */}
            <CustomerReviewsSection />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Modals and Drawers */}
      <FloatingStickyCart />
      <ProductQuickViewModal />
      <CartDrawer />
      <CheckoutModal />
      <VoiceAndInstantSearch />
      <AiStylistModal />
      <UserAccountModal />
      <AdminDashboard />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
