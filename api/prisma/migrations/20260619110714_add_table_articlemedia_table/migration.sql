-- AlterTable
ALTER TABLE `match_events` MODIFY `type` ENUM('goal', 'own_goal', 'yellow_card', 'red_card', 'second_yellow', 'substitution_in', 'substitution_out', 'penalty_scored', 'penalty_missed', 'card_rescinded', 'goal_disallowed') NOT NULL;

-- AlterTable
ALTER TABLE `match_results` ADD COLUMN `appeal_note` TEXT NULL,
    ADD COLUMN `appeal_reason` TEXT NULL,
    MODIFY `status` ENUM('official', 'protested', 'overturned', 'under_review') NOT NULL DEFAULT 'official';

-- AlterTable
ALTER TABLE `matches` ADD COLUMN `abandoned_minute` INTEGER NULL,
    ADD COLUMN `current_period` ENUM('first_half', 'second_half', 'extra_time_first', 'extra_time_second', 'penalty_shootout') NULL,
    ADD COLUMN `postponed_from` DATETIME(3) NULL,
    ADD COLUMN `postponed_reason` VARCHAR(191) NULL,
    ADD COLUMN `replay_of_match_id` INTEGER NULL,
    MODIFY `status` ENUM('scheduled', 'ongoing', 'finished', 'cancelled', 'forfeited', 'postponed', 'bye', 'abandoned') NOT NULL DEFAULT 'scheduled';

-- CreateTable
CREATE TABLE `articles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `cover_image` VARCHAR(191) NULL,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `user_id` INTEGER NOT NULL,
    `season_id` INTEGER NULL,
    `match_id` INTEGER NULL,
    `team_id` INTEGER NULL,
    `published_at` DATETIME(3) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `articles_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_id` INTEGER NOT NULL,
    `tag` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `article_tags_article_id_tag_key`(`article_id`, `tag`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article_media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_id` INTEGER NOT NULL,
    `type` ENUM('image', 'video') NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `caption` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_season_id_fkey` FOREIGN KEY (`season_id`) REFERENCES `seasons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article_media` ADD CONSTRAINT `article_media_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
