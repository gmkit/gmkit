import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import { Layout } from '@app/components/layout';
import Link from 'next/link';
import { serializeDates } from '@app/server/serialize-dates';

export default function CampaignView({ campaign }) {
  return (
    <Layout>
      <h1>{campaign.name}</h1>
      <ul>
        {campaign.encounters.map((encounter) => (
          <li>
            <Link
              as={`/campaigns/${campaign.id}/encounters/${encounter.id}`}
              href='/campaigns/[campaignId]/encounters/[encounterId]'
            >
              <a>{encounter.name}</a>
            </Link>
          </li>
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

  const encounters = await prisma.encounter.findMany({
    where: {
      campaignId: campaign.id,
    },
  });

  prisma.$disconnect();

  return {
    props: {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        encounters: serializeDates(encounters),
      },
    },
  };
};
