import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required to access the AI assistant.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(process.cwd(), "dist"));

  app.use(express.json());

  // API Endpoint for Culinary Assistant with Gemini High-Thinking
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      const ai = getGenAI();

      // Format chat history into the structure expected by the @google/genai SDK
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
            parts: [{ text: msg.content || msg.text || "" }],
          });
        }
      }

      // Append current message
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents,
        config: {
          systemInstruction: `You are 'Topzy Foods Chef AI', a highly intelligent, enthusiastic, and exceptionally warm culinary assistant for 'Topzy Foods', a premium restaurant located in Kumasi, Ghana.
Our contact phone is +233 59 840 4079. We are open Mon - Sun, 8:00 AM - 10:00 PM. We offer fast delivery inside Kumasi.

Topzy Foods Menu & Specialties:
- Main Meals: Jollof Rice & Chicken (₵45.00), Fried Rice & Chicken (₵42.00)
- Local Ghanaian: Fufu & Goat Soup (₵50.00), Banku & Tilapia (₵48.00), Waakye & Shito (₵35.00)
- Fast Food: Double Cheeseburger (₵38.00), Pizza Large (₵55.00), Chicken & Chips (₵32.00)
- Drinks: Fresh Fruit Juice (₵18.00), Milkshake (₵22.00)
- Today's Special Offers:
  1. Weekend Combo (₵55.00): Jollof rice, grilled chicken, chips & drink
  2. Spicy Tilapia Deal (₵45.00): Grilled tilapia with banku & pepper sauce
  3. Family Feast (₵120.00): Serves 4 (main, sides & drinks)
  4. Family Combo (₵150.00)

Delivery fees (based on distance):
- 0–2 km: ₵5.00
- 2–5 km: ₵10.00
- 5–10 km: ₵18.00
- 10–20 km: ₵30.00
- 20+ km: ₵45.00

You are running in Gemini's High-Thinking mode, giving you advanced analytical reasoning to craft deep culinary suggestions, detailed recommendations, answer dietary constraints, or design customized meal plans for the user. Be concise, warm, helpful, and polite. Always maintain a premium, friendly brand representation of Topzy Foods. Emphasize that your suggestions are carefully computed using high-thinking culinary models to suit their exact tastes!`,
          thinkingConfig: {
            // High thinking level as required by the instruction
            thinkingLevel: "HIGH" as any
          }
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Culinary Assistant error:", error);
      res.status(500).json({ error: error.message || "An error occurred in the thinking engine." });
    }
  });

  // Helper to fetch dynamic og:image from settings document or first menuItem
  async function getCustomOgImage(): Promise<string> {
    try {
      // 1. Try to get general settings containing custom ogImage
      const settingsUrl = "https://firestore.googleapis.com/v1/projects/gen-lang-client-0092088537/databases/ai-studio-topzyfoods-615bb36a-22ab-44ef-a14c-3555dd769a22/documents/settings/general";
      const settingsRes = await fetch(settingsUrl);
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        const imageUrl = settingsData?.fields?.ogImage?.stringValue;
        if (imageUrl && imageUrl.startsWith("http")) {
          return imageUrl;
        }
      }
    } catch (err) {
      console.error("Error fetching settings for og:image:", err);
    }

    try {
      // 2. Try to get first menu item image as fallback
      const menuUrl = "https://firestore.googleapis.com/v1/projects/gen-lang-client-0092088537/databases/ai-studio-topzyfoods-615bb36a-22ab-44ef-a14c-3555dd769a22/documents/menuItems?pageSize=1";
      const menuRes = await fetch(menuUrl);
      if (menuRes.ok) {
        const menuData = await menuRes.json();
        const firstItem = menuData?.documents?.[0];
        const imageUrl = firstItem?.fields?.imageUrl?.stringValue;
        if (imageUrl && imageUrl.startsWith("http")) {
          return imageUrl;
        }
      }
    } catch (err) {
      console.error("Error fetching menu items for og:image fallback:", err);
    }

    // 3. Ultimate Fallback default
    return "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=1200&h=630&fit=crop";
  }

  // Intercept index.html requests to inject the dynamic Cloudinary OG preview image
  app.get(["/", "/index.html"], async (req, res, next) => {
    try {
      let htmlPath = "";
      if (!isProduction) {
        htmlPath = path.join(process.cwd(), "index.html");
      } else {
        htmlPath = path.join(process.cwd(), "dist", "index.html");
      }

      if (!fs.existsSync(htmlPath)) {
        return next();
      }

      let html = fs.readFileSync(htmlPath, "utf-8");
      const ogImageUrl = await getCustomOgImage();

      // Replace Open Graph and Twitter image urls
      html = html.replace(
        /content="https:\/\/images\.unsplash\.com\/photo-1603569283847-aa295f0d016a\?w=1200&h=630&fit=crop"/g,
        `content="${ogImageUrl}"`
      );

      // In development, also transform via Vite if available
      if (!isProduction && (app as any).vite) {
        html = await (app as any).vite.transformIndexHtml(req.originalUrl, html);
      }

      res.setHeader("Content-Type", "text/html");
      res.status(200).send(html);
    } catch (err) {
      console.error("Error in dynamic HTML rendering:", err);
      next();
    }
  });

  // Vite middleware for development or static serving for production
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const viteInstance = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    (app as any).vite = viteInstance;
    app.use(viteInstance.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Topzy Foods Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
