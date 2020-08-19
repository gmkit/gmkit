import { PrismaClient } from '@prisma/client';

export default (req, res) => {
  const prisma = new PrismaClient();
  listUsers(prisma)
    .then((users) => {
      res.statusCode = 200;
      res.json({ message: 'Ya basic!', users });
    })
    .catch((e) => {
      console.error(e);
      res.statusCode = 500;
      res.json({ message: 'Uh oh' });
    })
    .finally(() => {
      prisma.$disconnect();
    });
};

async function listUsers(prisma: PrismaClient) {
  return prisma.user.findMany();
}
