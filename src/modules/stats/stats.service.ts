import { prisma } from "../../shared/utils/prisma";

const XP_PER_SESSION = 100;
const XP_STREAK_BONUS = 50;
const XP_PER_ACHIEVEMENT = 200;
const SESSIONS_PER_SHIELD = 5;

const LEVEL_THRESHOLDS = [
  { level: 1, name: "Rookie", minXp: 0 },
  { level: 2, name: "Athlete", minXp: 1000 },
  { level: 3, name: "Warrior", minXp: 2500 },
  { level: 4, name: "Champion", minXp: 5000 },
  { level: 5, name: "Legend", minXp: 10000 },
];

const calculateLevel = (totalXp: number) => {
  const current = [...LEVEL_THRESHOLDS]
    .reverse()
    .find((t) => totalXp >= t.minXp) ?? LEVEL_THRESHOLDS[0];

  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === current.level + 1);

  return {
    level: current.level,
    levelName: current.name,
    currentXp: totalXp,
    xpForNextLevel: nextThreshold?.minXp ?? null,
    xpProgress: nextThreshold ? totalXp - current.minXp : null,
    xpRequired: nextThreshold ? nextThreshold.minXp - current.minXp : null,
  };
};

const getDayOfWeek = (date: Date): string => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  return days[date.getDay()];
};

const isTrainingDay = (date: Date, trainingDays: string[]): boolean => {
  if (trainingDays.length === 0) return true;
  return trainingDays.includes(getDayOfWeek(date));
};

export const getOrCreateStats = async (userId: string) => {
  const existing = await prisma.userStats.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.userStats.create({ data: { userId } });
};

export const getStats = async (userId: string) => {
  const stats = await getOrCreateStats(userId);
  const levelInfo = calculateLevel(stats.totalXp);

  return { ...stats, ...levelInfo };
};

export const useShield = async (userId: string) => {
  const stats = await getOrCreateStats(userId);

  if (stats.shields <= 0) {
    throw new Error("NO_SHIELDS_AVAILABLE");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.userStats.update({
    where: { userId },
    data: {
      shields: { decrement: 1 },
      currentStreak: { increment: 1 },
      lastSessionDate: today,
    },
  });
};

const checkAndUnlockAchievements = async (
  userId: string,
  stats: { currentStreak: number; totalSessions: number },
  isFirstAiRoutine: boolean
) => {
  const allAchievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });

  const unlockedIds = new Set(userAchievements.map((a) => a.achievementId));
  const toUnlock: string[] = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue;

    const shouldUnlock =
      (achievement.key === "FIRST_REP" && stats.totalSessions >= 1) ||
      (achievement.key === "ON_FIRE" && stats.currentStreak >= 7) ||
      (achievement.key === "CONSISTENCY_KING" && stats.currentStreak >= 14) ||
      (achievement.key === "UNSTOPPABLE" && stats.currentStreak >= 30) ||
      (achievement.key === "IRON_WILL" && stats.totalSessions >= 50) ||
      (achievement.key === "CENTURY" && stats.totalSessions >= 100) ||
      (achievement.key === "AI_POWERED" && isFirstAiRoutine);

    if (shouldUnlock) {
      toUnlock.push(achievement.id);
    }
  }

  if (toUnlock.length > 0) {
    await prisma.userAchievement.createMany({
      data: toUnlock.map((achievementId) => ({ userId, achievementId })),
    });

    await prisma.userStats.update({
      where: { userId },
      data: { totalXp: { increment: toUnlock.length * XP_PER_ACHIEVEMENT } },
    });
  }

  return toUnlock.length;
};

export const processSessionStats = async (userId: string) => {
  const stats = await getOrCreateStats(userId);

  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: { trainingDays: true },
  });

  const trainingDays: string[] = JSON.parse(profile?.trainingDays ?? "[]");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newStreak = stats.currentStreak;

  if (stats.lastSessionDate) {
    const lastSession = new Date(stats.lastSessionDate);
    lastSession.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      newStreak = stats.currentStreak;
    } else if (diffDays === 1) {
      newStreak = stats.currentStreak + 1;
    } else {
      let streakBroken = false;
      for (let i = 1; i < diffDays; i++) {
        const missedDay = new Date(lastSession);
        missedDay.setDate(missedDay.getDate() + i);
        if (isTrainingDay(missedDay, trainingDays)) {
          streakBroken = true;
          break;
        }
      }
      newStreak = streakBroken ? 1 : stats.currentStreak + 1;
    }
  } else {
    newStreak = 1;
  }

  const newTotalSessions = stats.totalSessions + 1;
  const streakBonus = newStreak > stats.currentStreak ? XP_STREAK_BONUS : 0;
  const newXp = stats.totalXp + XP_PER_SESSION + streakBonus;
  const newBestStreak = Math.max(stats.bestStreak, newStreak);
  const newShields = Math.floor(newTotalSessions / SESSIONS_PER_SHIELD);

  const updatedStats = await prisma.userStats.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      totalSessions: newTotalSessions,
      totalXp: newXp,
      level: calculateLevel(newXp).level,
      shields: newShields,
      lastSessionDate: today,
    },
  });

  await checkAndUnlockAchievements(userId, updatedStats, false);

  return updatedStats;
};

export const processAiRoutineStats = async (userId: string) => {
  await checkAndUnlockAchievements(userId, { currentStreak: 0, totalSessions: 0 }, true);
};