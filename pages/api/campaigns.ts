import { handler } from '@app/server/handler';

export default handler(async (req, res, { prisma, session }) => {
  const { userId } = session

  if (req.method === 'POST') {
    const { name } = JSON.parse(req.body);

    return prisma.campaign.create(campaignWithGM(name, userId));
  } else {
    const campaigns = await prisma.userInCampaign.findMany(campaignsForUser(userId))

    return { campaigns }
  }
});

function campaignWithGM(campaignName: string, gmId: number) {
  return {
    data: {
      name: campaignName,
      users: {
        create: {
          role: 'GM' as 'GM',
          user: {
            connect: {
              id: gmId,
            },
          },
        },
      },
    },
  }
}

function campaignsForUser(userId: number) {
  return {
    where: {
      userId,
    },
    include: {
      campaign: true,
    },
  }
}