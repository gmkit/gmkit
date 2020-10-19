import { Form, Field } from 'react-final-form';
import { useEffect, useState } from 'react';
import { req } from '@app/req';
import styles from '@app/styles/Home.module.css';

function useCampaigns(): [any[], () => void] {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const load = async () => {
    const { campaigns } = await req.get('/api/campaigns');

    setCampaigns(campaigns);
  };

  useEffect(() => {
    load();
  }, []);

  return [campaigns, load];
}

export function CampaignList() {
  const [campaigns, reloadCampaigns] = useCampaigns();

  return (
    <>
      <Form
        onSubmit={async (campaign) => {
          await req.post('/api/campaigns', campaign);
          reloadCampaigns();
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
              <button type='submit'>Create Campaign</button>
            </form>
          );
        }}
      </Form>

      <div className={styles.grid}>
        {campaigns.map(({ campaign, role }) => {
          return (
            <div className={styles.card} key={campaign.id}>
              <h3>
                <a href={`/campaigns/${campaign.id}`}>{campaign.name}</a>
              </h3>
              <div>Role: {role}</div>
              <button
                onClick={async () => {
                  await req.delete(`/api/campaigns/${campaign.id}`);
                  reloadCampaigns();
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
