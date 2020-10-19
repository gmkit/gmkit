import { createCampaignWithGM, findCampaignsForUser } from "@app/prisma"
import { PrismaClient, User } from "@prisma/client"

let prisma: PrismaClient
let bob: User

beforeAll(() => {
  prisma = new PrismaClient()
  prisma.$connect()
})

afterAll(() => {
  prisma.$disconnect()
})

beforeEach(async () => {
  bob = await prisma.user.create({ data: { name: "Bob" } })
})

describe("Creating Campaigns", () => {
  it("sets a name", async () => {
    const name = "Test"

    const campaign = await prisma.campaign.create(createCampaignWithGM(name, bob.id))

    expect(campaign.name).toBe(name)
  })

  it("sets the user's role to 'GM'", async () => {
    const name = "Test"

    const campaign = await prisma.campaign.create(createCampaignWithGM(name, bob.id))

    const { role } = await prisma.userInCampaign.findOne({
      where: {
        userId_campaignId: {
          userId: bob.id,
          campaignId: campaign.id,
        }
      }
    })
    expect(role).toBe('GM')
  })
})

describe("Listing Campaigns", () => {
  it("returns an empty list when there are no campaigns", async () => {
    const campaigns = await prisma.userInCampaign.findMany(findCampaignsForUser(bob.id))

    expect(campaigns).toEqual([])
  })

  it("returns the campaign if they are the GM", async () => {
    const campaignName = "The World of Woodcraft"
    const campaignCreatedByBob = await prisma.campaign.create(createCampaignWithGM(campaignName, bob.id))

    const bobsCampaigns = await prisma.userInCampaign.findMany(findCampaignsForUser(bob.id))

    const { role, campaign } = bobsCampaigns.find(({ campaignId }) => campaignId === campaignCreatedByBob.id)
    expect(role).toBe('GM')
  })

  it("returns an empty list if they are not the GM", async () => {
    const george = await prisma.user.create({ data: { name: "George" } })
    const campaignName = "The World of Woodcraft"
    // Campaign Created by George
    await prisma.campaign.create(createCampaignWithGM(campaignName, george.id))

    const bobsCampaigns = await prisma.userInCampaign.findMany(findCampaignsForUser(bob.id))

    expect(bobsCampaigns).toEqual([])
  })
})
