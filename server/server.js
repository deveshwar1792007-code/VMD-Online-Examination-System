import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    message: "VMD backend is running",
  });
});

app.post("/api/generate-questions", async (req, res) => {
  try {
    const { subject, difficulty } = req.body;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are an examination question generator. Return exactly 20 multiple-choice questions as valid JSON.",
        },
        {
          role: "user",
          content: `Generate 20 multiple-choice questions for ${subject}.
Difficulty: ${difficulty}.

Return JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0
    }
  ]
}

The answer must be the zero-based index of the correct option.`,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || "";

    res.json({
      success: true,
      data: text,
    });
  } catch (error) {
  console.error("Groq error:", error);

  res.status(500).json({
    success: false,
    error: error?.message || "Failed to generate questions",
  });
}
});

app.listen(3001, () => {
  console.log("VMD backend running on http://localhost:3001");
});
