/*
  Warnings:

  - You are about to drop the column `attributes` on the `Variant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "attributes";

-- CreateTable
CREATE TABLE "VariantAttributes" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VariantAttributes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "VariantAttributes" ADD CONSTRAINT "VariantAttributes_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
