import { Form, Field } from 'react-final-form';
import React, { useEffect, useState } from 'react';
import { req } from '@app/req';
import styles from '@app/styles/Home.module.css';
import { Button } from '../button';
import { Input } from '../input';

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
      <h2>Campaigns</h2>
      <Form
        onSubmit={async (campaign) => {
          await req.post('/api/campaigns', campaign);
          reloadCampaigns();
        }}
      >
        {({ handleSubmit }) => {
          return (
            <form style={{ display: "flex", flexDirection: "column", }} onSubmit={handleSubmit}>
              <label htmlFor="name" style={{ padding: "0.5rem" }}>
                Campaign Name
                <Field
                  id="name"
                  name='name'
                  component={Input}
                  validate={(name) => {
                    if (!name) {
                      return 'Required';
                    }
                  }}
                />
              </label>
              <Button type='submit' >Create Campaign</Button>
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
