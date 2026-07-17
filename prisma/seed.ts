import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const achievements = [
  {
    key: "FIRST_REP",
    name: "First Rep",
    description: "Complete your first workout session",
    xpReward: 200,
  },
  {
    key: "ON_FIRE",
    name: "On Fire",
    description: "Maintain a 7-day streak",
    xpReward: 200,
  },
  {
    key: "CONSISTENCY_KING",
    name: "Consistency King",
    description: "Maintain a 14-day streak",
    xpReward: 200,
  },
  {
    key: "UNSTOPPABLE",
    name: "Unstoppable",
    description: "Maintain a 30-day streak",
    xpReward: 200,
  },
  {
    key: "IRON_WILL",
    name: "Iron Will",
    description: "Complete 50 workout sessions",
    xpReward: 200,
  },
  {
    key: "CENTURY",
    name: "Century",
    description: "Complete 100 workout sessions",
    xpReward: 200,
  },
  {
    key: "AI_POWERED",
    name: "AI Powered",
    description: "Generate your first AI workout routine",
    xpReward: 200,
  },
];

const main = async () => {
  console.log("Seeding achievements...");

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {},
      create: achievement,
    });
  }

  console.log("Seeding completed.");
};

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());