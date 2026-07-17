import { prisma } from "../../shared/utils/prisma";
import { OllamaProvider } from "./providers/ollama.provider";
import { GroqProvider } from "./providers/groq.provider";
import type { AIProvider } from "./providers/ai-provider.interface";
import { env } from "../../config/env";
import { processAiRoutineStats } from "../stats/stats.service";

const getProvider = (): AIProvider => {
  if (env.aiProvider === "groq") {
    return new GroqProvider();
  }
  return new OllamaProvider();
};

const buildPrompt = (profile: {
  age: number;
  weight: number;
  height: number;
  goal: string;
  level: string;
  unitSystem: string;
}): string => {
  const isImperial = profile.unitSystem === "IMPERIAL";
  const weightUnit = isImperial ? "lb" : "kg";
  const heightUnit = isImperial ? "in" : "cm";

  return `You are a professional fitness coach. Generate a weekly workout routine for a person with the following profile:
- Age: ${profile.age} years
- Weight: ${profile.weight} ${weightUnit}
- Height: ${profile.height} ${heightUnit}
- Fitness goal: ${profile.goal.replace(/_/g, " ").toLowerCase()}
- Fitness level: ${profile.level.toLowerCase()}

Provide a structured 5-day workout plan. For each day include:
1. Muscle groups targeted
2. List of exercises with sets, reps, and rest time
3. Estimated duration

Keep the response clear and practical. Respond in the same language the user is likely to use.`;
};

export const generateRoutine = async (userId: string): Promise<string> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  const prompt = buildPrompt(profile);
  const provider = getProvider();

  await processAiRoutineStats(userId);

  return provider.generateRoutine(prompt);
};