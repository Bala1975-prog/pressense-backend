import express from "express";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Fact check this news article:\n\n${text}`
    });

    res.json({ result: result.text });

  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on", port);
});