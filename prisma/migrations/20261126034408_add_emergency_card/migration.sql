-- CreateTable
CREATE TABLE "EmergencyCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "epilepsyType" TEXT NOT NULL,
    "usualDuration" TEXT NOT NULL,
    "doList" TEXT NOT NULL,
    "dontList" TEXT NOT NULL,
    "medications" TEXT NOT NULL,
    "allergies" TEXT NOT NULL,
    "neurologistName" TEXT NOT NULL,
    "neurologistPhone" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyCard_userId_key" ON "EmergencyCard"("userId");

-- AddForeignKey
ALTER TABLE "EmergencyCard" ADD CONSTRAINT "EmergencyCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
