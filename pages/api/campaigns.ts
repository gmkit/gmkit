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

  try {
    if (req.method === 'POST') {
      const { name } = JSON.parse(req.body);
      const campaign = await createCampaign(prisma, userId, name);
      res.status(200);
      res.json(campaign);
    } else {
      const campaigns = findCampaignsForUser(prisma, userId);
      res.status(200);
      res.json({ campaigns });
    }
  } catch (error) {
    res.status(500);
    res.json({ error });
  }
  prisma.$disconnect();
});

async function createCampaign(
  prisma: PrismaClient,
  userId: number,
  name: string
) {
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
  return campaign;
}

async function findCampaignsForUser(prisma: PrismaClient, userId: number) {
  const { campaigns } = await prisma.user.findOne({
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
  return campaigns;
}
