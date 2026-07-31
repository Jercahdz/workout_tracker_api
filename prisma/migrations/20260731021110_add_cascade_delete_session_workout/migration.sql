-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_workoutId_fkey`;

-- DropIndex
DROP INDEX `sessions_workoutId_fkey` ON `sessions`;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
