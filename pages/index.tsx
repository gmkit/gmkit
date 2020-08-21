import Head from 'next/head';
import styles from '@app/styles/Home.module.css';
import AuthButtons from '@app/components/auth-buttons';
import { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';

const req = {
  get(url: string) {
    return fetch(url).then((response) => response.json());
  },

  post(url: string, body: any) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }).then((response) => response.json());
  },

  delete(url: string) {
    return fetch(url, { method: 'DELETE' }).then((response) => response.json());
  },
};

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

export default function Home() {
  const [campaigns, reloadCampaigns] = useCampaigns();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href='https://nextjs.org'>Next.js!</a>
        </h1>

        <p className={styles.description}>
          <AuthButtons />
        </p>
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
                <h3>{campaign.name}</h3>
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
      </main>

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <img src='/vercel.svg' alt='Vercel Logo' className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
