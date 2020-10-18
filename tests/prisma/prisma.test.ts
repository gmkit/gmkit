import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

beforeAll(() => {
  prisma = new PrismaClient()
  prisma.$connect()
})

afterAll(() => {
  prisma.$disconnect()
})

describe("PrismaClient", () => {
  it("can create a user with the proper name", async () => {
    const name = "Test"

    const user = await prisma.user.create({
      data: {
        name
      }
    })

    expect(user.name).toBe(name)
  })



})