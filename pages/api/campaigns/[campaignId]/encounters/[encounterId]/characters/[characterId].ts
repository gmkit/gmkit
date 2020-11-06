import { PrismaClient } from '@prisma/client';
import { handler } from '@app/server/handler';

export default handler(async (req, { prisma }) => {
  const characterId = ~~(req.query.characterId as string);

  await deleteCharacter(prisma, characterId);

  return { id: characterId }
});

/**
 * Deletes a Character in a campaign
 */
async function deleteCharacter(prisma: PrismaClient, characterId: number) {
  await prisma.encounterCharacter.delete({
    where: {
      id: characterId,
    },
  });
}
