/*
  Warnings:

  - You are about to drop the column `evidence_json` on the `tournament_rules` table. All the data in the column will be lost.
  - You are about to drop the column `import_note` on the `tournament_rules` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `tournament_rules` table. All the data in the column will be lost.
  - You are about to drop the column `source_file_url` on the `tournament_rules` table. All the data in the column will be lost.
  - You are about to drop the `oauth_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `passkey_credentials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `oauth_accounts` DROP FOREIGN KEY `oauth_accounts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `passkey_credentials` DROP FOREIGN KEY `passkey_credentials_user_id_fkey`;

-- AlterTable
ALTER TABLE `tournament_rules` DROP COLUMN `evidence_json`,
    DROP COLUMN `import_note`,
    DROP COLUMN `source`,
    DROP COLUMN `source_file_url`;

-- DropTable
DROP TABLE `oauth_accounts`;

-- DropTable
DROP TABLE `passkey_credentials`;
