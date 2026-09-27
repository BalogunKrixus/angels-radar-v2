-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isSeedData" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "founder_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "photo" TEXT,
    "title" TEXT,
    "linkedin" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "founder_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "startups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "founderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "industry" TEXT NOT NULL,
    "foundedYear" INTEGER,
    "problem" TEXT,
    "solution" TEXT,
    "businessModel" TEXT,
    "targetMarket" TEXT,
    "productDescription" TEXT,
    "stage" TEXT NOT NULL,
    "amountRaising" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "previousFunding" TEXT,
    "fundingUse" TEXT,
    "revenue" TEXT,
    "revenueRange" TEXT,
    "customerCount" TEXT,
    "growthInfo" TEXT,
    "tractionNotes" TEXT,
    "teamDescription" TEXT,
    "pitchDeckPath" TEXT,
    "pitchDeckOriginalName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "adminNote" TEXT,
    "isSeedData" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" DATETIME,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "startups_founderId_fkey" FOREIGN KEY ("founderId") REFERENCES "founder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "bio" TEXT,
    "linkedin" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "team_members_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startupId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "links_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "investor_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "photo" TEXT,
    "jobTitle" TEXT,
    "organisation" TEXT,
    "investorType" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT,
    "linkedin" TEXT,
    "website" TEXT,
    "investmentThesis" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "adminNote" TEXT,
    "isSeedData" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "investor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "investor_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investorId" TEXT NOT NULL,
    "sectors" JSONB NOT NULL DEFAULT [],
    "countries" JSONB NOT NULL DEFAULT [],
    "stages" JSONB NOT NULL DEFAULT [],
    "ticketRanges" JSONB NOT NULL DEFAULT [],
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "investor_preferences_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investor_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "introduction_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "investorId" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "investorNote" TEXT,
    "isSeedData" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "introduction_requests_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "investor_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "introduction_requests_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "analytics_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "founder_profiles_userId_key" ON "founder_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "startups_founderId_key" ON "startups"("founderId");

-- CreateIndex
CREATE INDEX "startups_status_idx" ON "startups"("status");

-- CreateIndex
CREATE INDEX "startups_industry_idx" ON "startups"("industry");

-- CreateIndex
CREATE INDEX "startups_country_idx" ON "startups"("country");

-- CreateIndex
CREATE INDEX "startups_stage_idx" ON "startups"("stage");

-- CreateIndex
CREATE UNIQUE INDEX "investor_profiles_userId_key" ON "investor_profiles"("userId");

-- CreateIndex
CREATE INDEX "investor_profiles_status_idx" ON "investor_profiles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "investor_preferences_investorId_key" ON "investor_preferences"("investorId");

-- CreateIndex
CREATE INDEX "introduction_requests_status_idx" ON "introduction_requests"("status");

-- CreateIndex
CREATE INDEX "introduction_requests_startupId_idx" ON "introduction_requests"("startupId");

-- CreateIndex
CREATE INDEX "introduction_requests_investorId_idx" ON "introduction_requests"("investorId");

-- CreateIndex
CREATE INDEX "analytics_events_type_idx" ON "analytics_events"("type");
