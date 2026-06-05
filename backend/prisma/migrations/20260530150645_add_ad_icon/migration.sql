-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'group',
    "city" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "instrument" TEXT,
    "about" TEXT,
    "lookingFor" TEXT,
    "description" TEXT,
    "contact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ad" ("about", "city", "contact", "createdAt", "description", "genre", "id", "instrument", "lookingFor", "status", "type", "updatedAt", "userId") SELECT "about", "city", "contact", "createdAt", "description", "genre", "id", "instrument", "lookingFor", "status", "type", "updatedAt", "userId" FROM "Ad";
DROP TABLE "Ad";
ALTER TABLE "new_Ad" RENAME TO "Ad";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
