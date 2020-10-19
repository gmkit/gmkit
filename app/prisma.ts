

export function createCampaignWithGM(campaignName: string, gmId: number) {
  return {
    data: {
      name: campaignName,
      users: {
        create: {
          role: 'GM',
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

export function findCampaignsForUser(userId: number) {
  return {
    where: {
      userId,
    },
    include: {
      campaign: true,
    },
  }
}