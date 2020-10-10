import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@app/server/require-auth';

export default requireAuth(async (req, res) => {
  const prisma = new PrismaClient();

  const campaignId = ~~(req.query.campaignId as string);

  try {
    if (req.method === 'POST') {
      const { name } = JSON.parse(req.body);
      const campaign = await createEncounter(prisma, campaignId, name);
      res.status(200);
      res.json(campaign);
    } else {
      const encounters = await findCampaignEncounters(prisma, campaignId);
      res.status(200);
      res.json({ encounters });
    }
  } catch (error) {
    res.status(500);
    res.json({ error });
  }
  prisma.$disconnect();
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
