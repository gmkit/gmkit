import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import { Layout } from '@app/components/layout';
import { serializeDates } from '@app/server/serialize-dates';

export default function EncounterView({ encounter }) {
  return (
    <Layout>
      <h1>{encounter.name}</h1>
      <ul>
        {encounter.characters.map((character) => (
          <li>{character.name}</li>
        ))}
      </ul>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const prisma = new PrismaClient();
  const { accessToken } = await getSession({ req });
  const { userId } = await prisma.session.findOne({
    where: {
      accessToken,
    },
  });
  const campaignId = ~~params.campaignId;
  const encounterId = ~~params.encounterId;

  const { campaign } = await prisma.userInCampaign.findOne({
    where: {
      userId_campaignId: {
        campaignId,
        userId,
      },
    },
    include: {
      campaign: true,
    },
  });

  const encounter = await prisma.encounter.findOne({
    where: {
      id: encounterId,
    },
    include: {
      characters: true,
    },
  });

  prisma.$disconnect();

  return {
    props: {
      encounter: serializeDates(encounter),
    },
  };
};
