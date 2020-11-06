import { EncounterCharacterCreateArgs, PrismaClient } from "@prisma/client";
import { handler, NotImplementedError } from "@app/server/handler";

export default handler(async ({ req, prisma }) => {
  // TODO: Check user authentication
  // TODO: Check campaign existence and access
  // TODO: Check encounter existence and access
  if (req.method === "POST") {
    const { name, initiative = 0 } = JSON.parse(req.body);
    const character = await createCharacter(prisma, {
      encounter: {
        connect: {
          id: ~~(req.query.encounterId as string),
        },
      },
      name,
      initiative: ~~initiative,
    });
    return character;
  } else {
    throw new NotImplementedError();
  }
});

async function createCharacter(
  prisma: PrismaClient,
  data: EncounterCharacterCreateArgs["data"]
) {
  const campaign = await prisma.encounterCharacter.create({
    data,
  });
  return campaign;
}
