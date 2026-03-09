import cors from "cors";
import express from "express";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 8080;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Analyze the following news text and detect bias or manipulation:\n\n" +
                    text,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    res.json({
      result: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No result",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.listen(PORT, () => {
  console.log(`PressSense backend running on port ${PORT}`);
});
