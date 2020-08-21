import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import { Layout } from '@app/components/layout';

export default function CampaignView({ campaign }) {
  return (
    <Layout>
      <h1>{campaign.name}</h1>
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
  const campaignId = ~~params.id;

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

  prisma.$disconnect();

  return {
    props: {
      campaign: {
        id: campaign.id,
        name: campaign.name,
      },
    },
  };
};
