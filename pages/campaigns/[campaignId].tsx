import { req } from '@app/req';
import { Form, Field } from 'react-final-form';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';
import { GetServerSideProps } from 'next';
import { Layout } from '@app/components/layout';
import Link from 'next/link';
import { serializeDates } from '@app/server/serialize-dates';
import styles from '@app/styles/Home.module.css';
import { useState } from 'react';

export default function CampaignView({ campaign }) {
  const [encounters, setEncounters] = useState(campaign.encounters);

  return (
    <Layout>
      <h1>{campaign.name}</h1>
      <Form
        onSubmit={async (encounter) => {
          await req.post(`/api/campaigns/${campaign.id}/encounters`, encounter);
          const { encounters } = await req.get(
            `/api/campaigns/${campaign.id}/encounters`
          );
          setEncounters(encounters);
        }}
      >
        {({ handleSubmit }) => {
          return (
            <form className={styles.description} onSubmit={handleSubmit}>
              <Field
                name='name'
                component='input'
                validate={(name) => {
                  if (!name) {
                    return 'Required';
                  }
                }}
              />
              <button type='submit'>Create Encounter</button>
            </form>
          );
        }}
      </Form>
      <ul>
        {encounters.map((encounter) => (
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
