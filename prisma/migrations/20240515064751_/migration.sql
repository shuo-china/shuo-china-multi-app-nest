-- DropIndex
DROP INDEX `admin_roles_on_users_roleId_fkey` ON `admin_roles_on_users`;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalName` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `extension` VARCHAR(191) NOT NULL,
    `mime` VARCHAR(191) NOT NULL,
    `size` BIGINT NOT NULL,
    `isImage` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_roles_on_users` ADD CONSTRAINT `admin_roles_on_users_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `admin_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_roles_on_users` ADD CONSTRAINT `admin_roles_on_users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `admin_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
