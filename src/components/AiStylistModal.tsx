import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, X, Send, Bot, User, CheckCircle, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export const AiStylistModal: React.FC = () => {
  const { isAiStylistOpen, setIsAiStylistOpen, language, products, storeConfig } = useStore();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text:
        language === 'ar'
          ? 'مرحباً بك في متجر المعراج للأزياء الملكية! أنا مستشارك الذكي للموضة والأناقة. كيف يمكنني مساعدتك في تنسيق ملابسك أو اختيار البدلة، الحذاء والإكسسوار المناسب لمناسبتك اليوم؟'
          : 'Welcome to Al-Miraj Royal Luxury Fashion! I am your AI Fashion Stylist. How can I assist you in selecting the perfect suit, shoes, or outfit today?',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAiStylistOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isLoading) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // Formulate context for Gemini from products
      const availableProducts = products
        .slice(0, 10)
        .map((p) => `- ${p.nameAr} (${p.price} د.ل)`)
        .join('\n');

      const systemPrompt = `أنت مستشار أناقة وموضة خبير لمتجر "المعراج" للأزياء الملكية والرجالية والنسائية الفاخرة في ليبيا.
المتجر يقدم أرقى الخامات الإيطالية والأوروبية، بدلات، أحذية فاخرة، ساعات، وأزياء.
المنتجات المتاحة حالياً:
${availableProducts}

أجب الزبون بأسلوب راقٍ، مهذب، وفاخر باللغة العربية. اعطِ نصائح تنسيق الألوان والمناسبات (أعراس، اجتماعات، خروج كاجوال) واقترح منتجات المتجر بأسلوب جذّاب.`;

      // Call Gemini via standard client or fallback mock guidance if offline
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nسؤال الزبون: ${userText}`,
        });

        const reply = response.text || (language === 'ar' ? 'يسعدنا خدمتك دائماً في متجر المعراج.' : 'Happy to serve you at Al-Miraj.');
        setMessages((prev) => [...prev, { role: 'model', text: reply }]);
      } else {
        // Smart localized fallback reply
        let reply = '';
        if (userText.includes('بدلة') || userText.includes('عرس') || userText.includes('مناسبة')) {
          reply = language === 'ar'
            ? 'نوصيك باختيار البدلة الرسمية الإيطالية Slim Fit باللون الكحلي الملكي أو الأسود، مع قميص أبيض ناصع وحذاء كلاسيكي من الجلد الطبيعي لتطل بأعلى درجات الأناقة والهيبة.'
            : 'For formal events, we strongly recommend our Italian Slim Fit royal suit paired with a crisp white shirt and handcrafted leather shoes.';
        } else if (userText.includes('حذاء') || userText.includes('مقاس')) {
          reply = language === 'ar'
            ? 'أحذيتنا مصنعة من أوداج الجلد الطبيعي 100% بتشطيب يدوّي. يمكنك اختيار مقاسك المعتاد في الأحذية الإيطالية أو التواصل معنا عبر الواتساب لإرسال قياس القدم بدقة.'
            : 'Our footwear is crafted from 100% natural leather. You can order your standard European fit or ask our WhatsApp team for size verification.';
        } else {
          reply = language === 'ar'
            ? 'نسعد بتقديم استشارات الأناقة المجانية! جميع القطع متوفرة في متجرنا مع إمكانية المعاينة والتجربة المباشرة في فرعنا بني وليد - شارع القوايده.'
            : 'We offer complimentary styling advice! All luxury collections are available for viewing and fitting at our store in Bani Walid - Al-Quwaydah St.';
        }
        setMessages((prev) => [...prev, { role: 'model', text: reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text:
            language === 'ar'
              ? 'تتوفر تشكيلات فاخرة عديدة في متجرنا. يسعدنا تصفحك للأقسام واختيار ما يناسب ذوقك الرفيع.'
              : 'Feel free to explore our luxury collections in the store sections.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto box-sizing-border-box">
      {/* Backdrop */}
      <div
        onClick={() => setIsAiStylistOpen(false)}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      {/* Centered Modal (90% width, max 450px) */}
      <div className="relative z-10 w-[90vw] max-w-[450px] max-h-[90vh] overflow-y-auto bg-[#0B1120] rounded-3xl border border-blue-500/30 p-4 sm:p-5 shadow-2xl my-auto box-sizing-border-box text-slate-100 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white border border-blue-400/30">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">
                {language === 'ar' ? 'مستشار الموضة والأناقة الذكي' : 'AI Fashion Stylist'}
              </h3>
              <p className="text-[10px] text-sky-400">
                {language === 'ar' ? 'تنسيق بدلات وأطقم المعراج' : 'Al-Miraj Styling Advisor'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAiStylistOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 max-h-[300px] overflow-y-auto space-y-3 p-2 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'model' && (
                <div className="w-6 h-6 rounded-full bg-blue-600/40 text-sky-300 border border-blue-400/40 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-[11px] p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>{language === 'ar' ? 'جاري تحليل خيارات الأناقة...' : 'Analyzing fashion combos...'}</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder={
              language === 'ar'
                ? 'اسأل المستشار: كيف أنسق بدلة عرس؟'
                : 'Ask AI: What suit fits my event?'
            }
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMsg.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center transition border border-blue-400/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
