import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser with increased limit for audio base64 uploads
  app.use(express.json({ limit: "25mb" }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Gemini Bio Refiner / Content Assistant
  app.post("/api/ai/refine-bio", async (req, res) => {
    try {
      const { bio, instruction, name, title } = req.body;
      if (!bio && !instruction) {
        return res.status(400).json({ error: "Bio or instruction is required." });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            text: `Artist Name: ${name || "Dennis Mabuka"}
Current Title: ${title || "Digital Artist from East Africa"}
Current Bio:
${bio || ""}

User Request / Instruction:
${instruction || "Refine this artist bio to be punchy, compelling, maintaining the focus on East African digital art, open source, 3D, and the intersection of art and technology."}

Provide an updated, polished bio in first-person ("I'm ..."). Keep line breaks clean. Do not add conversational markdown wrappers or preamble, return just the bio text.`,
          },
        ],
        config: {
          systemInstruction:
            "You are an assistant for Dennis Mabuka, an East African digital artist, creative technologist, and open-source enthusiast. Your tone is authentic, minimalist, futuristic, and humble.",
          temperature: 0.7,
        },
      });

      const refinedBio = response.text?.trim() || "";
      res.json({ refinedBio });
    } catch (err: any) {
      console.error("Error in /api/ai/refine-bio:", err);
      res.status(500).json({
        error: err.message || "Failed to refine bio with Gemini.",
      });
    }
  });

  // Audio Transcription using gemini-3.5-transcribe
  app.post("/api/ai/transcribe", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: "audioBase64 is required." });
      }

      const ai = getGeminiClient();
      const cleanedMimeType = mimeType || "audio/webm";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-transcribe",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanedMimeType,
                data: audioBase64,
              },
            },
            {
              text: "Please transcribe the speech in this audio accurately. Only output the transcribed text with no extra conversational remarks.",
            },
          ],
        },
      });

      const transcription = response.text?.trim() || "";
      res.json({ transcription });
    } catch (err: any) {
      console.error("Error in /api/ai/transcribe:", err);
      res.status(500).json({
        error: err.message || "Failed to transcribe audio with Gemini.",
      });
    }
  });

  // Gemini Project Suggestion / Description Generator
  app.post("/api/ai/suggest-project", async (req, res) => {
    try {
      const { title, url, category } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required." });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            text: `Project Title: ${title}
Project URL: ${url || "N/A"}
Category: ${category || "Recent explorations"}

Write a short, engaging one-sentence blurb describing this creative exploration by digital artist Dennis Mabuka. Output only the short description.`,
          },
        ],
        config: {
          temperature: 0.5,
        },
      });

      const description = response.text?.trim() || "";
      res.json({ description });
    } catch (err: any) {
      console.error("Error in /api/ai/suggest-project:", err);
      res.status(500).json({
        error: err.message || "Failed to generate project suggestion.",
      });
    }
  });

  // Vite middleware for development / static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dennis Mabuka personal site server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
