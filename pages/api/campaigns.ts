import { PrismaClient, Session } from '@prisma/client';
import { handler } from '@app/server/handler';

export default handler(async (req, res, { prisma, session }) => {
  const { userId } = session

  if (req.method === 'POST') {
    const { name } = JSON.parse(req.body);
    const campaign = await createCampaign(prisma, userId, name);
    return campaign
  } else {
    const campaigns = await findCampaignsForUser(prisma, userId);
    return { campaigns }
  }
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
