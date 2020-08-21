import Head from 'next/head';
import styles from '@app/styles/Home.module.css';
import AuthButtons from '@app/components/auth-buttons';
import { useSession } from 'next-auth/client';
import { CampaignList } from '@app/components/campaigns/campaign-list';

export default function Home() {
  const [session] = useSession();
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
        {session && <CampaignList />}
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
