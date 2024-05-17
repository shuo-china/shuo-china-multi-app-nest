/*
  Warnings:

  - Added the required column `message` to the `Error` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `admin_roles_on_users_roleId_fkey` ON `admin_roles_on_users`;

-- AlterTable
ALTER TABLE `error` ADD COLUMN `message` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `admin_roles_on_users` ADD CONSTRAINT `admin_roles_on_users_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `admin_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_roles_on_users` ADD CONSTRAINT `admin_roles_on_users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `admin_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
