import Head from 'next/head';
import styles from '@app/styles/Home.module.css';
import AuthButtons from '@app/components/auth-buttons';

export function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>GMKit</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1>Welcome to GMKit</h1>
        <p className={styles.description}>
          <AuthButtons />
        </p>
        {children}
      </main>
    </div>
  );
}
