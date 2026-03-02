-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'New conversation';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
