-- ============================================================================
-- Entre Nous - PostgreSQL Database Schema
-- ============================================================================
-- This script creates the complete database schema for Entre Nous game.
-- Compatible with PostgreSQL 14+
-- ============================================================================

-- Create database (if running as superuser)
-- CREATE DATABASE entre_nous;

-- Set connection to the database
-- \c entre_nous;

-- ============================================================================
-- GAMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Game" (
  "id" VARCHAR(255) PRIMARY KEY,
  "code" CHAR(6) NOT NULL UNIQUE,
  "status" VARCHAR(50) NOT NULL DEFAULT 'waiting' CHECK ("status" IN ('waiting', 'active', 'ended')),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL,
  "metadata" JSONB DEFAULT '{}',
  "notes" TEXT
);

CREATE INDEX idx_game_status ON "Game"("status");
CREATE INDEX idx_game_expiresAt ON "Game"("expiresAt");
CREATE INDEX idx_game_code ON "Game"("code");

-- ============================================================================
-- PLAYERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Player" (
  "id" VARCHAR(255) PRIMARY KEY,
  "gameId" VARCHAR(255) NOT NULL REFERENCES "Game"("id") ON DELETE CASCADE,
  "role" INTEGER NOT NULL CHECK ("role" IN (1, 2)),
  "sessionToken" VARCHAR(255) UNIQUE,
  "joinedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastActivity" TIMESTAMP,
  "disconnectedAt" TIMESTAMP,
  "metadata" JSONB DEFAULT '{}',
  UNIQUE("gameId", "role")
);

CREATE INDEX idx_player_gameId ON "Player"("gameId");
CREATE INDEX idx_player_role ON "Player"("role");
CREATE INDEX idx_player_sessionToken ON "Player"("sessionToken");

-- ============================================================================
-- CHALLENGE CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "ChallengeCategory" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT,
  "emoji" VARCHAR(10),
  "color" VARCHAR(7),
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_challengecategory_active ON "ChallengeCategory"("active");

-- ============================================================================
-- CHALLENGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Challenge" (
  "id" VARCHAR(255) PRIMARY KEY,
  "type" VARCHAR(50) NOT NULL CHECK ("type" IN ('open_question', 'creative', 'quick', 'mirror', 'choice')),
  "prompt" TEXT NOT NULL,
  "categoryId" VARCHAR(255) NOT NULL REFERENCES "ChallengeCategory"("id") ON DELETE RESTRICT,
  "difficulty" VARCHAR(20) CHECK ("difficulty" IN ('easy', 'medium', 'hard')),
  "active" BOOLEAN NOT NULL DEFAULT true,
  "usageCount" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_challenge_categoryId ON "Challenge"("categoryId");
CREATE INDEX idx_challenge_active ON "Challenge"("active");
CREATE INDEX idx_challenge_type ON "Challenge"("type");

-- ============================================================================
-- PLAYER CATEGORY PREFERENCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "PlayerCategoryPreference" (
  "id" VARCHAR(255) PRIMARY KEY,
  "playerId" VARCHAR(255) NOT NULL REFERENCES "Player"("id") ON DELETE CASCADE,
  "categoryId" VARCHAR(255) NOT NULL REFERENCES "ChallengeCategory"("id") ON DELETE CASCADE,
  "preference" INTEGER CHECK ("preference" >= 0 AND "preference" <= 5),
  "setAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("playerId", "categoryId")
);

CREATE INDEX idx_playercategorypreference_playerId ON "PlayerCategoryPreference"("playerId");
CREATE INDEX idx_playercategorypreference_categoryId ON "PlayerCategoryPreference"("categoryId");

-- ============================================================================
-- AVAILABLE CHALLENGES FOR A GAME TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "GameChallenge" (
  "id" VARCHAR(255) PRIMARY KEY,
  "gameId" VARCHAR(255) NOT NULL REFERENCES "Game"("id") ON DELETE CASCADE,
  "challengeId" VARCHAR(255) NOT NULL REFERENCES "Challenge"("id") ON DELETE RESTRICT,
  "order" INTEGER NOT NULL,
  "usedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gamechallenge_gameId ON "GameChallenge"("gameId");
CREATE INDEX idx_gamechallenge_challengeId ON "GameChallenge"("challengeId");
CREATE INDEX idx_gamechallenge_usedAt ON "GameChallenge"("usedAt");

-- ============================================================================
-- USED CHALLENGES HISTORY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "ChallengeHistory" (
  "id" VARCHAR(255) PRIMARY KEY,
  "gameId" VARCHAR(255) NOT NULL REFERENCES "Game"("id") ON DELETE CASCADE,
  "challengeId" VARCHAR(255) NOT NULL REFERENCES "Challenge"("id") ON DELETE RESTRICT,
  "order" INTEGER NOT NULL,
  "presentedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP
);

CREATE INDEX idx_challengehistory_gameId ON "ChallengeHistory"("gameId");
CREATE INDEX idx_challengehistory_challengeId ON "ChallengeHistory"("challengeId");
CREATE INDEX idx_challengehistory_presentedAt ON "ChallengeHistory"("presentedAt");

-- ============================================================================
-- RESPONSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Response" (
  "id" VARCHAR(255) PRIMARY KEY,
  "gameId" VARCHAR(255) NOT NULL REFERENCES "Game"("id") ON DELETE CASCADE,
  "playerId" VARCHAR(255) NOT NULL REFERENCES "Player"("id") ON DELETE CASCADE,
  "challengeId" VARCHAR(255) NOT NULL REFERENCES "Challenge"("id") ON DELETE RESTRICT,
  "content" VARCHAR(5000) NOT NULL,
  "wordCount" INTEGER,
  "submittedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "editedAt" TIMESTAMP
);

CREATE INDEX idx_response_gameId ON "Response"("gameId");
CREATE INDEX idx_response_playerId ON "Response"("playerId");
CREATE INDEX idx_response_challengeId ON "Response"("challengeId");
CREATE INDEX idx_response_submittedAt ON "Response"("submittedAt");

-- ============================================================================
-- MESSAGES (CHAT) TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Message" (
  "id" VARCHAR(255) PRIMARY KEY,
  "gameId" VARCHAR(255) NOT NULL REFERENCES "Game"("id") ON DELETE CASCADE,
  "playerId" VARCHAR(255) NOT NULL REFERENCES "Player"("id") ON DELETE CASCADE,
  "content" VARCHAR(1000) NOT NULL,
  "type" VARCHAR(50) DEFAULT 'text' CHECK ("type" IN ('text', 'system', 'reaction')),
  "metadata" JSONB DEFAULT '{}',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deletedAt" TIMESTAMP
);

CREATE INDEX idx_message_gameId ON "Message"("gameId");
CREATE INDEX idx_message_playerId ON "Message"("playerId");
CREATE INDEX idx_message_type ON "Message"("type");
CREATE INDEX idx_message_createdAt ON "Message"("createdAt");

-- ============================================================================
-- SESSION TOKENS TABLE (for JWT/temporary sessions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "SessionToken" (
  "id" VARCHAR(255) PRIMARY KEY,
  "playerId" VARCHAR(255) NOT NULL REFERENCES "Player"("id") ON DELETE CASCADE,
  "token" VARCHAR(500) NOT NULL UNIQUE,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP
);

CREATE INDEX idx_sessiontoken_playerId ON "SessionToken"("playerId");
CREATE INDEX idx_sessiontoken_token ON "SessionToken"("token");
CREATE INDEX idx_sessiontoken_expiresAt ON "SessionToken"("expiresAt");

-- ============================================================================
-- GAME STATISTICS TABLE (for analytics)
-- ============================================================================
CREATE TABLE IF NOT EXISTS "GameStatistic" (
  "id" VARCHAR(255) PRIMARY KEY,
  "gameId" VARCHAR(255) NOT NULL REFERENCES "Game"("id") ON DELETE CASCADE UNIQUE,
  "totalChallenges" INTEGER DEFAULT 0,
  "completedChallenges" INTEGER DEFAULT 0,
  "totalMessages" INTEGER DEFAULT 0,
  "averageResponseLength" FLOAT,
  "player1Responses" INTEGER DEFAULT 0,
  "player2Responses" INTEGER DEFAULT 0,
  "durationSeconds" INTEGER,
  "endedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gamestatistic_gameId ON "GameStatistic"("gameId");

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
-- All tables created successfully. Ready to seed data.
