import {
  EncounterCharacterArgs,
  EncounterCharacterCreateArgs,
  PrismaClient,
} from '@prisma/client';
import { requireAuth } from '@app/server/require-auth';
import { serializeDates } from '@app/server/serialize-dates';

export default requireAuth(async (req, res) => {
  const prisma = new PrismaClient();

  // TODO: Check user authentication
  // TODO: Check campaign existence and access
  // TODO: Check encounter existence and access
  try {
    if (req.method === 'POST') {
      const { name, initiative = 0, ...test } = JSON.parse(req.body);
      console.log({ name, initiative, ...test });
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
  } catch (error) {
    res.status(500);
    console.log(error);
    res.json({ ...error });
  }
  prisma.$disconnect();
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
