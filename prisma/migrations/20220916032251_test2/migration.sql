/*
  Warnings:

  - You are about to drop the column `gameId` on the `Ad` table. All the data in the column will be lost.
  - Added the required column `game` to the `Ad` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "yearsPlaying" INTEGER NOT NULL,
    "discord" TEXT NOT NULL,
    "weekDays" TEXT NOT NULL,
    "hourStart" INTEGER NOT NULL,
    "hourEnd" INTEGER NOT NULL,
    "useVoiceChannel" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ad" ("createdAt", "discord", "hourEnd", "hourStart", "id", "name", "useVoiceChannel", "userId", "weekDays", "yearsPlaying") SELECT "createdAt", "discord", "hourEnd", "hourStart", "id", "name", "useVoiceChannel", "userId", "weekDays", "yearsPlaying" FROM "Ad";
DROP TABLE "Ad";
ALTER TABLE "new_Ad" RENAME TO "Ad";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
