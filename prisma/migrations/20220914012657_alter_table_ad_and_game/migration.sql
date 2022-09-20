/*
  Warnings:

  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Ad` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "bannerUrl" TEXT NOT NULL
);
INSERT INTO "new_Game" ("bannerUrl", "id", "title") SELECT "bannerUrl", "id", "title" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Ad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "yearsPlaying" INTEGER NOT NULL,
    "discord" TEXT NOT NULL,
    "weekDays" TEXT NOT NULL,
    "hourStart" INTEGER NOT NULL,
    "hourEnd" INTEGER NOT NULL,
    "useVoiceChannel" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ad_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ad" ("createdAt", "discord", "gameId", "hourEnd", "hourStart", "id", "name", "useVoiceChannel", "userId", "weekDays", "yearsPlaying") SELECT "createdAt", "discord", "gameId", "hourEnd", "hourStart", "id", "name", "useVoiceChannel", "userId", "weekDays", "yearsPlaying" FROM "Ad";
DROP TABLE "Ad";
ALTER TABLE "new_Ad" RENAME TO "Ad";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
