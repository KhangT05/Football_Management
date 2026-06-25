-- CreateTable
CREATE TABLE `team_jerseys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_id` INTEGER NOT NULL,
    `type` ENUM('home', 'away', 'third', 'goalkeeper') NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL,
    `secondary_color` VARCHAR(191) NULL,

    UNIQUE INDEX `team_jerseys_team_id_type_key`(`team_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `season_team_jerseys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `season_team_id` INTEGER NOT NULL,
    `type` ENUM('home', 'away', 'third', 'goalkeeper') NOT NULL,
    `primary_color` VARCHAR(191) NOT NULL,
    `secondary_color` VARCHAR(191) NULL,
    `image_url` VARCHAR(191) NULL,

    UNIQUE INDEX `season_team_jerseys_season_team_id_type_key`(`season_team_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `match_lineups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `match_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `jersey_number` INTEGER NOT NULL,
    `position` ENUM('goalkeeper', 'defender', 'midfielder', 'forward') NOT NULL,
    `lineup_type` ENUM('starter', 'substitute') NOT NULL DEFAULT 'starter',
    `is_captain` BOOLEAN NOT NULL DEFAULT false,
    `minute_in` INTEGER NULL,
    `minute_out` INTEGER NULL,
    `status` ENUM('available', 'injured', 'suspended', 'absent') NOT NULL DEFAULT 'available',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `match_lineups_match_id_player_id_key`(`match_id`, `player_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `team_jerseys` ADD CONSTRAINT `team_jerseys_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `season_team_jerseys` ADD CONSTRAINT `season_team_jerseys_season_team_id_fkey` FOREIGN KEY (`season_team_id`) REFERENCES `season_teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_lineups` ADD CONSTRAINT `match_lineups_match_id_fkey` FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_lineups` ADD CONSTRAINT `match_lineups_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `match_lineups` ADD CONSTRAINT `match_lineups_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
