import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@app/server/require-auth';

export default requireAuth(async (req, res) => {
  const prisma = new PrismaClient();
  const characterId = ~~(req.query.characterId as string);
  try {
    await deleteCharacter(prisma, characterId);
    res.status(200);
    res.json({ message: `Campaign Deleted`, id: characterId });
  } catch (error) {
    res.status(500);
    res.json({ error: error.message });
  }
  prisma.$disconnect();
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
