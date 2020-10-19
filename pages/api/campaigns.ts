import { findCampaignsForUser, createCampaignWithGM } from '@app/prisma';
import { handler } from '@app/server/handler';

export default handler(async (req, res, { prisma, session }) => {
  const { userId } = session

  if (req.method === 'POST') {
    const { name } = JSON.parse(req.body);

    return prisma.campaign.create(createCampaignWithGM(name, userId));
  } else {
    const campaigns = await prisma.userInCampaign.findMany(findCampaignsForUser(userId))

    return { campaigns }
  }
});