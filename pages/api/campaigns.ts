import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';
import { requireAuth } from '@app/server/require-auth';

export default requireAuth(async (req, res) => {
  const prisma = new PrismaClient();
  const { accessToken } = await getSession({ req });
  const { userId } = await prisma.session.findOne({
    where: {
      accessToken,
    },
  });

  if (req.method === 'POST') {
    try {
      const { name } = JSON.parse(req.body);
      const campaign = await prisma.campaign.create({
        data: {
          name,
          users: {
            create: {
              role: 'GM',
              user: {
                connect: {
                  id: userId,
                },
              },
            },
          },
        },
      });

      res.status(200);
      res.json(campaign);
    } catch (error) {
      res.status(500);
      res.json({ error });
    }
  } else {
    const user = await prisma.user.findOne({
      where: {
        id: userId,
      },
      include: {
        campaigns: {
          include: {
            campaign: true,
          },
        },
      },
    });
    res.status(200);
    res.json({ campaigns: user.campaigns });
  }
  prisma.$disconnect();
});
