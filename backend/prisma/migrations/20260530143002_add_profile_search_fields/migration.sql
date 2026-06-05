-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MusicianProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "genres" TEXT NOT NULL DEFAULT '',
    "citySearch" TEXT NOT NULL DEFAULT '',
    "instrumentSearch" TEXT NOT NULL DEFAULT '',
    "genresSearch" TEXT NOT NULL DEFAULT '',
    "experience" TEXT NOT NULL,
    "photo" TEXT,
    "demoUrl" TEXT,
    "description" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MusicianProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MusicianProfile" ("city", "demoUrl", "description", "experience", "genres", "id", "instrument", "photo", "updatedAt", "userId") SELECT "city", "demoUrl", "description", "experience", "genres", "id", "instrument", "photo", "updatedAt", "userId" FROM "MusicianProfile";
DROP TABLE "MusicianProfile";
ALTER TABLE "new_MusicianProfile" RENAME TO "MusicianProfile";
CREATE UNIQUE INDEX "MusicianProfile_userId_key" ON "MusicianProfile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
