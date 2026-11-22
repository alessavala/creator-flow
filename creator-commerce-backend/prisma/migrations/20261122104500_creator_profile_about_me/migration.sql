-- Optional self-declared profile highlights for the public Creator Passport.
ALTER TABLE "CreatorProfile"
  ADD COLUMN "age" INTEGER,
  ADD COLUMN "familyRole" TEXT;
