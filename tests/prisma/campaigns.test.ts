import { createCampaignWithGM } from "@app/prisma"
import { PrismaClient, User } from "@prisma/client"

let prisma: PrismaClient

beforeAll(() => {
  prisma = new PrismaClient()
  prisma.$connect()
})

afterAll(() => {
  prisma.$disconnect()
})

describe("createCampaignWithGM", () => {
  let user: User

  beforeEach(async () => {
    user = await prisma.user.create({ data: { name: "Bob" } })
  })

  it("sets name properly", async () => {
    const name = "Test"

    const campaign = await prisma.campaign.create(createCampaignWithGM(name, user.id))

    expect(campaign.name).toBe(name)
  })

  it("the user has the 'GM' role", async () => {
    const name = "Test"

    const campaign = await prisma.campaign.create(createCampaignWithGM(name, user.id))

    const { role } = await prisma.userInCampaign.findOne({
      where: {
        userId_campaignId: {
          userId: user.id,
          campaignId: campaign.id,
        }
      }
    })
    expect(role).toBe('GM')
  })
})
