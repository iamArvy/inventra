/*
  Warnings:

  - You are about to drop the column `delete_at` on the `Product` table. All the data in the column will be lost.
  - Changed the type of `price` on the `Variant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "delete_at",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL;
