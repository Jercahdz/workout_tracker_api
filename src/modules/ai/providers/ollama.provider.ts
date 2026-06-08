import { env } from "../../../config/env";
import type { AIProvider } from "./ai-provider.interface";

export class OllamaProvider implements AIProvider {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor() {
    this.baseUrl = env.ollamaBaseUrl;
    this.model = env.ollamaModel;
  }

  async generateRoutine(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("OLLAMA_ERROR");
    }

    const data = await response.json() as { response: string };
    return data.response;
  }
}