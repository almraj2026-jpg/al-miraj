import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI lazily
  let aiClient: GoogleGenAI | null = null;
  const getAi = () => {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  };

  // API Route for AI Stylist
  app.post('/api/stylist', async (req, res) => {
    try {
      const { prompt, catalog, language } = req.body;
      const ai = getAi();

      if (!ai) {
        // Fallback response if API key is not configured
        return res.json({
          reply:
            language === 'ar'
              ? 'أهلاً بك! ننصحك بـ "بدلة المعراج الملكية الكحلي الداكن" مع حذاء أكسفورد إيطالي أصلي وساعة سويسرية ذهبية لإطلالة فاخرة تليق بحضورك.'
              : 'Welcome! We recommend our Royal Navy Executive Suit paired with genuine Oxford leather shoes and a Swiss timepiece.',
        });
      }

      const systemInstruction = `You are the elite AI Fashion Stylist for Al-Miraj (المعراج), a luxury fashion store in Libya. 
      Help the customer select outfits, suits, abayas, shoes, and watches from Al-Miraj's collection.
      Tone: Prestigious, polite, helpful, luxury fashion expert.
      Available Catalog Sample:
      ${catalog || ''}
      Language to respond in: ${language === 'en' ? 'English' : 'Arabic'}. Keep it concise (2-3 sentences max).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || (language === 'ar' ? 'أنا بخدمتك في اختيار أجمل إطلالة لليوم.' : 'I am at your service to curate your luxury look.');
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Stylist API Error:', err);
      res.json({
        reply:
          req.body.language === 'en'
            ? 'We recommend pairing our Navy Royal Suit with genuine leather Oxford shoes for maximum prestige.'
            : 'ننصحك بدمج البدلة الكحلي الملكية مع حذاء جلد طبيعي وساعة سويسرية متناسقة لإطلالة فاخرة.',
      });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Al-Miraj Server running at http://localhost:${PORT}`);
  });
}

startServer();
