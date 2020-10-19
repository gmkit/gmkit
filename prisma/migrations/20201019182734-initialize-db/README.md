# Migration `20201019182734-initialize-db`

This migration has been generated by ncphillips at 10/19/2020, 3:27:34 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."users_in_campaign" DROP COLUMN "role",
ADD COLUMN "role" text   NOT NULL DEFAULT E'GM'

DROP TYPE "CampaignRole"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201019182734-initialize-db
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,115 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = ["sqlite", "postgresql"]
+  url = "***"
+}
+
+model User {
+  id            Int       @id @default(autoincrement())
+  name          String?
+  email         String?   @unique
+  emailVerified DateTime? @map(name: "email_verified")
+  image         String?
+  createdAt     DateTime  @default(now()) @map(name: "created_at")
+  updatedAt     DateTime  @default(now()) @map(name: "updated_at")
+
+  campaigns UserInCampaign[]
+  @@map(name: "users")
+}
+
+model Account {
+  id                 Int       @id @default(autoincrement())
+  compoundId         String    @unique @map(name: "compound_id")
+  userId             Int       @map(name: "user_id")
+  providerType       String    @map(name: "provider_type")
+  providerId         String    @map(name: "provider_id")
+  providerAccountId  String    @map(name: "provider_account_id")
+  refreshToken       String?   @map(name: "refresh_token")
+  accessToken        String?   @map(name: "access_token")
+  accessTokenExpires DateTime? @map(name: "access_token_expires")
+  createdAt          DateTime  @default(now()) @map(name: "created_at")
+  updatedAt          DateTime  @default(now()) @map(name: "updated_at")
+
+
+  @@index([providerAccountId], name: "providerAccountId")
+  @@index([providerId], name: "providerId")
+  @@index([userId], name: "userId")
+  @@map(name: "accounts")
+}
+
+model Session {
+  id           Int      @id @default(autoincrement())
+  userId       Int      @map(name: "user_id")
+  expires      DateTime
+  sessionToken String   @unique @map(name: "session_token")
+  accessToken  String   @unique @map(name: "access_token")
+  createdAt    DateTime @default(now()) @map(name: "created_at")
+  updatedAt    DateTime @default(now()) @map(name: "updated_at")
+
+  @@map(name: "sessions")
+}
+
+model VerificationRequest {
+  id         Int      @id @default(autoincrement())
+  identifier String
+  token      String   @unique
+  expires    DateTime
+  createdAt  DateTime @default(now()) @map(name: "created_at")
+  updatedAt  DateTime @default(now()) @map(name: "updated_at")
+
+  @@map(name: "verification_requests")
+}
+
+model Campaign {
+  id        Int      @id @default(autoincrement())
+  name      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+
+  users      UserInCampaign[]
+  encounters Encounter[]
+  @@map(name: "campaigns")
+}
+
+model UserInCampaign {
+  user       User     @relation(fields: [userId], references: [id])
+  userId     Int
+  campaign   Campaign @relation(fields: [campaignId], references: [id])
+  campaignId Int
+  createdAt  DateTime @default(now())
+  role       String   @default("GM")
+
+  @@id([userId, campaignId])
+  @@map(name: "users_in_campaign")
+}
+
+model Encounter {
+  id                Int      @id @default(autoincrement())
+  name              String
+  createdAt         DateTime @default(now())
+  updatedAt         DateTime @default(now())
+  campaign          Campaign @relation(fields: [campaignId], references: [id])
+  campaignId        Int
+  activeCharacterId Int?
+
+  characters EncounterCharacter[]
+
+  @@map(name: "encounters")
+}
+
+model EncounterCharacter {
+  id        Int      @id @default(autoincrement())
+  name      String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+
+  encounter   Encounter @relation(fields: [encounterId], references: [id])
+  encounterId Int
+
+  initiative   Int
+  referenceUrl String?
+  @@map(name: "encounter_characters")
+}
```

