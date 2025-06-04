/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[refresh_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_role_id_fkey";

-- DropIndex
DROP INDEX "UserRole_user_id_role_id_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refresh_token" TEXT;

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "RolePermission";

-- CreateIndex
CREATE UNIQUE INDEX "User_refresh_token_key" ON "User"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_user_id_key" ON "UserRole"("user_id");
