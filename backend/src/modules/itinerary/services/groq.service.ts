import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export class GroqService {
  async generateItinerary(prompt: string) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are an expert travel planner.

Always return ONLY valid JSON.

Do not use markdown.

Do not wrap JSON inside \`\`\`.

Never explain anything.

The JSON must follow exactly the structure requested by the user.
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.6,

      response_format: {
        type: "json_object",
      },
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error("Groq returned an empty response.");
    }

    return JSON.parse(response);
  }
}