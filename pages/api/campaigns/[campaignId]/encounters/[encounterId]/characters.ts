import { EncounterCharacterCreateArgs, PrismaClient } from '@prisma/client';
import { serializeDates } from '@app/server/serialize-dates';
import { handler } from '@app/server/handler';

export default handler(async (req, res, { prisma }) => {
  // TODO: Check user authentication
  // TODO: Check campaign existence and access
  // TODO: Check encounter existence and access
  if (req.method === 'POST') {
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
    res.status(200);
    res.json(serializeDates(character));
  } else {
    res.status(404);
  }
});

async function createCharacter(
  prisma: PrismaClient,
  data: EncounterCharacterCreateArgs['data']
) {
  const campaign = await prisma.encounterCharacter.create({
    data,
  });
  return campaign;
}
