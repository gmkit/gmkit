import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@app/server/require-auth';

export default requireAuth(async (req, res) => {
  const prisma = new PrismaClient();
  const id = ~~(req.query.id as string);
  try {
    await deleteCampaign(prisma, id);
    res.status(200);
    res.json({ message: `Campaign Deleted`, id });
  } catch (error) {
    res.status(500);
    res.json({ error: error.message });
  }
  prisma.$disconnect();
});

/**
 * Deletes all UserInCampaign join tables then deletes the Campaign
 */
async function deleteCampaign(prisma: PrismaClient, campaignId: number) {
  await prisma.userInCampaign.deleteMany({
    where: {
      campaignId,
    },
  });

  await prisma.campaign.delete({
    where: {
      id: campaignId,
    },
  });
}
