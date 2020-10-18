import { PrismaClient } from '@prisma/client';
import { handler } from '@app/server/handler';

export default handler(async (req, res, { prisma }) => {
  const users = await listUsers(prisma);

  return { users }
});

async function listUsers(prisma: PrismaClient) {
  return prisma.user.findMany();
}
