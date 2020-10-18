# Migration `20201018231823-allow-for-sqlite`

This migration has been generated at 10/18/2020, 8:18:23 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."users_in_campaign" DROP COLUMN "role",
ADD COLUMN "role" text   NOT NULL 

DROP TYPE "CampaignRole"
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200915204852-encounter-has-active-character..20201018231823-allow-for-sqlite
--- datamodel.dml
+++ datamodel.dml
@@ -2,14 +2,14 @@
   provider = "prisma-client-js"
 }
 datasource db {
-  provider = "postgresql"
-  url = "***"
+  provider = ["sqlite", "postgresql"]
+  url = "***"
 }
 model User {
-  id            Int       @default(autoincrement()) @id
+  id            Int       @id @default(autoincrement())
   name          String?
   email         String?   @unique
   emailVerified DateTime? @map(name: "email_verified")
   image         String?
@@ -20,9 +20,9 @@
   @@map(name: "users")
 }
 model Account {
-  id                 Int       @default(autoincrement()) @id
+  id                 Int       @id @default(autoincrement())
   compoundId         String    @unique @map(name: "compound_id")
   userId             Int       @map(name: "user_id")
   providerType       String    @map(name: "provider_type")
   providerId         String    @map(name: "provider_id")
@@ -32,17 +32,17 @@
   accessTokenExpires DateTime? @map(name: "access_token_expires")
   createdAt          DateTime  @default(now()) @map(name: "created_at")
   updatedAt          DateTime  @default(now()) @map(name: "updated_at")
+
   @@index([providerAccountId], name: "providerAccountId")
   @@index([providerId], name: "providerId")
   @@index([userId], name: "userId")
-
   @@map(name: "accounts")
 }
 model Session {
-  id           Int      @default(autoincrement()) @id
+  id           Int      @id @default(autoincrement())
   userId       Int      @map(name: "user_id")
   expires      DateTime
   sessionToken String   @unique @map(name: "session_token")
   accessToken  String   @unique @map(name: "access_token")
@@ -52,9 +52,9 @@
   @@map(name: "sessions")
 }
 model VerificationRequest {
-  id         Int      @default(autoincrement()) @id
+  id         Int      @id @default(autoincrement())
   identifier String
   token      String   @unique
   expires    DateTime
   createdAt  DateTime @default(now()) @map(name: "created_at")
@@ -63,9 +63,9 @@
   @@map(name: "verification_requests")
 }
 model Campaign {
-  id        Int      @default(autoincrement()) @id
+  id        Int      @id @default(autoincrement())
   name      String
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now())
@@ -73,27 +73,22 @@
   encounters Encounter[]
   @@map(name: "campaigns")
 }
-enum CampaignRole {
-  GM
-  PLAYER
-}
-
 model UserInCampaign {
-  user       User         @relation(fields: [userId], references: [id])
+  user       User     @relation(fields: [userId], references: [id])
   userId     Int
-  campaign   Campaign     @relation(fields: [campaignId], references: [id])
+  campaign   Campaign @relation(fields: [campaignId], references: [id])
   campaignId Int
-  createdAt  DateTime     @default(now())
-  role       CampaignRole
+  createdAt  DateTime @default(now())
+  role       String
   @@id([userId, campaignId])
   @@map(name: "users_in_campaign")
 }
 model Encounter {
-  id                Int      @default(autoincrement()) @id
+  id                Int      @id @default(autoincrement())
   name              String
   createdAt         DateTime @default(now())
   updatedAt         DateTime @default(now())
   campaign          Campaign @relation(fields: [campaignId], references: [id])
@@ -105,9 +100,9 @@
   @@map(name: "encounters")
 }
 model EncounterCharacter {
-  id        Int      @default(autoincrement()) @id
+  id        Int      @id @default(autoincrement())
   name      String
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now())
```


