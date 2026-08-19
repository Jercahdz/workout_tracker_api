import Groq from "groq-sdk";
import { env } from "../../../config/env";
import type { AIProvider } from "./ai-provider.interface";

export class GroqProvider implements AIProvider {
  private readonly client: Groq;
  private readonly model: string;

  constructor() {
    this.client = new Groq({ apiKey: env.groqApiKey });
    this.model = env.groqModel;
  }

  async generateRoutine(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: this.model,
      max_tokens: 4000,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("GROQ_ERROR");
    }

    return content;
  }
}