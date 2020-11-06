import { PrismaClient } from '@prisma/client';
import { handler } from '@app/server/handler';

export default handler(async ({ req, prisma }) => {
  const id = ~~(req.query.campaignId as string);
  await deleteCampaign(prisma, id);
  return { message: `Campaign Deleted`, id }
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
