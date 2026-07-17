-- AlterTable
ALTER TABLE `profiles` ADD COLUMN `trainingDays` VARCHAR(191) NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE `user_stats` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `currentStreak` INTEGER NOT NULL DEFAULT 0,
    `bestStreak` INTEGER NOT NULL DEFAULT 0,
    `totalSessions` INTEGER NOT NULL DEFAULT 0,
    `totalXp` INTEGER NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `shields` INTEGER NOT NULL DEFAULT 0,
    `lastSessionDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_stats_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `achievements` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `xpReward` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `achievements_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_achievements` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `achievementId` VARCHAR(191) NOT NULL,
    `unlockedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_achievements_userId_achievementId_key`(`userId`, `achievementId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_stats` ADD CONSTRAINT `user_stats_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_achievements` ADD CONSTRAINT `user_achievements_achievementId_fkey` FOREIGN KEY (`achievementId`) REFERENCES `achievements`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
