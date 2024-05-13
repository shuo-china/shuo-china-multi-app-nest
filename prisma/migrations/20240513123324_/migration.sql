-- DropIndex
DROP INDEX `admin_roles_on_users_roleId_fkey` ON `admin_roles_on_users`;

-- AddForeignKey
ALTER TABLE `admin_roles_on_users` ADD CONSTRAINT `admin_roles_on_users_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `admin_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_roles_on_users` ADD CONSTRAINT `admin_roles_on_users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `admin_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
