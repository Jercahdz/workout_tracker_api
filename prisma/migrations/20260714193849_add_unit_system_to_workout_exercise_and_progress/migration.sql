-- AlterTable
ALTER TABLE `progress_logs` ADD COLUMN `unitSystem` ENUM('METRIC', 'IMPERIAL') NOT NULL DEFAULT 'METRIC';

-- AlterTable
ALTER TABLE `workout_exercises` ADD COLUMN `unitSystem` ENUM('METRIC', 'IMPERIAL') NOT NULL DEFAULT 'METRIC';
