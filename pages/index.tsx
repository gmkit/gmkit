import Head from 'next/head';
import styles from '@app/styles/Home.module.css';
import AuthButtons from '@app/components/auth-buttons';
import campaigns from './api/campaigns';
import { useState, useEffect } from 'react';

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
};

function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  useEffect(() => {
    req.get('/api/campaigns').then(({ campaigns }) => {
      setCampaigns(campaigns);
    });
  }, []);
  return [campaigns];
}
export default function Home() {
  const [campaigns] = useCampaigns();

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
          <button
            onClick={() => {
              req
                .post('/api/campaigns', {
                  name: 'Example Campaign',
                })
                .then((data) => console.log(data));
            }}
          >
            Create Campaign
          </button>
        </p>

        <div className={styles.grid}>
          {campaigns.map(({ campaign, role }) => {
            return (
              <div className={styles.card} key={campaign.id}>
                <h3>{campaign.name}</h3>
                <div>Role: {role}</div>
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
