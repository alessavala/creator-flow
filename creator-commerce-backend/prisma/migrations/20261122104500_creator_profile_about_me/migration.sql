-- Optional self-declared profile highlights for the public Creator Passport.
ALTER TABLE "CreatorProfile"
  ADD COLUMN "age" INTEGER,
  ADD COLUMN "isParent" BOOLEAN NOT NULL DEFAULT false;
