/*
  Warnings:

  - You are about to alter the column `size` on the `file` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - Added the required column `updatedAt` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `admin_roles_on_users_roleId_fkey` ON `admin_roles_on_users`;

-- AlterTable
ALTER TABLE `file` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `size` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `admin_roles_on_users` ADD CONSTRAINT `admin_roles_on_users_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `admin_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_roles_on_users` ADD CONSTRAINT `admin_roles_on_users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `admin_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
