import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  MessageCircle,
  CreditCard,
  Building,
  User,
  Phone,
  MapPin,
  Send,
  Store,
  Clock,
  Banknote,
  Sparkles,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    language,
    storeConfig,
    addToast,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'mis'>('cod');

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalAmount = subtotal;

  const handleSendWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      addToast(
        'warning',
        language === 'ar' ? 'بيانات غير مكتملة' : 'Incomplete Form',
        language === 'ar' ? 'يرجى تعبئة الاسم ورقم الهاتف بشكل صحيح' : 'Please fill required fields'
      );
      return;
    }

    // Generate formatted WhatsApp message for In-Store Pickup
    let message = `*طلب حجز واستلام من المحل - متجر ${storeConfig.storeNameAr}* 🏬\n\n`;
    message += `👤 *اسم المستلم:* ${customerName}\n`;
    message += `📞 *رقم الهاتف:* ${phone}\n`;
    message += `📍 *موقع الاستلام:* الفرع الرئيسي (${storeConfig.addressAr})\n`;
    message += `🕒 *ساعات العمل:* ${storeConfig.businessHoursAr}\n`;
    message += `💳 *طريقة الدفع في المحل:* ${paymentMethod === 'cod' ? 'نقداً في المحل (Cash)' : `بطاقة مصرفية / MIS (${storeConfig.misNumber})`}\n`;
    if (pickupNotes.trim()) message += `📝 *ملاحظات وتاريخ الاستلام:* ${pickupNotes}\n`;

    message += `\n*القطع المحجوزة للاستلام:*\n`;
    cart.forEach((item, index) => {
      const pName = language === 'ar' ? item.product.nameAr : item.product.nameEn;
      const cName = item.selectedColor ? (language === 'ar' ? item.selectedColor.nameAr : item.selectedColor.nameEn) : 'قياسي';
      const sName = item.selectedSize || 'قياسي';
      message += `${index + 1}. ${pName} | اللون: ${cName} | المقاس: ${sName} | العدد: ${item.quantity} | السعر: ${item.product.price * item.quantity} ${storeConfig.currencyAr}\n`;
    });

    message += `\n💰 *الإجمالي الكلي:* ${totalAmount} ${storeConfig.currencyAr}\n`;
    message += `\n_تم حجز هذا الطلب للاستلام المباشر عبر تطبيق متجر المعراج_✨`;

    const encoded = encodeURIComponent(message);
    const cleanNum = storeConfig.whatsAppNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanNum}?text=${encoded}`;

    window.open(waUrl, '_blank');

    addToast(
      'success',
      language === 'ar' ? 'تم تجهيز طلب الاستلام' : 'Pickup Order Prepared',
      language === 'ar' ? 'سيتم توجيهك لمحادثة الواتساب لتأكيد موعد الاستلام' : 'Redirecting to WhatsApp'
    );

    clearCart();
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto box-sizing-border-box">
      {/* Dimmed Overlay */}
      <div
        onClick={() => setIsCheckoutOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Responsive Centered Modal Container */}
      <div className="relative z-10 w-[90vw] max-w-[450px] max-h-[90vh] overflow-y-auto bg-[#0B1120] rounded-3xl border border-blue-500/30 p-4 sm:p-6 shadow-2xl my-auto box-sizing-border-box text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Store className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">
                {language === 'ar' ? 'تأكيد الطلب (الاستلام من المحل)' : 'In-Store Pickup Confirmation'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'ar' ? 'تجهيز الفاتورة للاستلام المباشر من الفرع' : 'Reserve items for store pickup'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Store Location Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-950/50 border border-blue-800/60 mb-4 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>{language === 'ar' ? 'فرع الاستلام الرئيسي:' : 'Pickup Store Location:'}</span>
          </div>
          <p className="text-slate-200 font-medium text-[11px] pr-6 rtl:pr-6 rtl:pl-0">
            {language === 'ar' ? storeConfig.addressAr : storeConfig.addressEn}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1 border-t border-blue-900/40">
            <Clock className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
            <span>{language === 'ar' ? storeConfig.businessHoursAr : storeConfig.businessHoursEn}</span>
          </div>
        </div>

        {/* Order Brief Summary */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-4 text-xs space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>{language === 'ar' ? 'عدد القطع المحجوزة:' : 'Reserved Items:'}</span>
            <span className="font-bold text-white">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{language === 'ar' ? 'طريقة الاستلام:' : 'Pickup Method:'}</span>
            <span className="font-bold text-emerald-400">{language === 'ar' ? 'استلام شخصي من المحل' : 'In-Store Pickup'}</span>
          </div>
          <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/60">
            <span>{language === 'ar' ? 'إجمالي الفاتورة:' : 'Total Amount:'}</span>
            <span className="font-extrabold text-sky-400">
              {totalAmount} {language === 'ar' ? storeConfig.currencyAr : storeConfig.currencyEn}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSendWhatsAppOrder} className="space-y-3 text-xs">
          {/* Customer Name */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {language === 'ar' ? 'اسم المستلم الثلاثي:' : 'Recipient Full Name:'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder={language === 'ar' ? 'أدخل اسمك الكريم لاستلام الطلب' : 'Enter recipient name'}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3 rtl:right-3 rtl:left-auto top-3" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {language === 'ar' ? 'رقم الهاتف للتواصل:' : 'Phone Number:'}
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="091XXXXXXX / 092XXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 rtl:right-3 rtl:left-auto top-3" />
            </div>
          </div>

          {/* Payment Method at Store */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {language === 'ar' ? 'طريقة الدفع عند الاستلام بالمحل:' : 'In-Store Payment Method:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px]">{language === 'ar' ? 'نقداً بالمحل (Cash)' : 'Cash at Store'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mis')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                  paymentMethod === 'mis'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4 text-sky-400" />
                <span className="text-[10px]">{language === 'ar' ? 'بطاقة مصرفية / MIS' : 'Bank Card / MIS'}</span>
              </button>
            </div>
          </div>

          {/* Optional Pickup Notes */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              {language === 'ar' ? 'موعد الاستلام المتوقع / ملاحظات:' : 'Expected Pickup Date & Notes:'}
            </label>
            <textarea
              rows={2}
              placeholder={language === 'ar' ? 'مثال: سأحضر اليوم الساعة 5 مساءً للاستلام...' : 'Specify pickup time or requests...'}
              value={pickupNotes}
              onChange={(e) => setPickupNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95 border border-emerald-400/30 mt-4"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>{language === 'ar' ? 'إرسال حجز الطلب عبر الواتساب' : 'Send Pickup Reservation via WhatsApp'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
