import { PrismaClient } from '@prisma/client';
import { handler } from '@app/server/handler';

export default handler(async (req, res, { prisma }) => {
  const campaignId = ~~(req.query.campaignId as string);

  if (req.method === 'POST') {
    const { name } = JSON.parse(req.body);
    const campaign = await createEncounter(prisma, campaignId, name);
    res.json(campaign);
  } else {
    const encounters = await findCampaignEncounters(prisma, campaignId);
    res.json({ encounters });
  }
});

async function createEncounter(
  prisma: PrismaClient,
  campaignId: number,
  name: string
) {
  const encounter = await prisma.encounter.create({
    data: {
      name,
      campaign: {
        connect: {
          id: campaignId,
        },
      },
    },
  });
  return encounter;
}

async function findCampaignEncounters(
  prisma: PrismaClient,
  campaignId: number
) {
  const { encounters } = await prisma.campaign.findOne({
    where: {
      id: campaignId,
    },
    include: {
      encounters: true,
    },
  });

  return encounters;
}
