import "@app/styles/globals.css";
import { Provider as AuthProvider } from "next-auth/client";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <script
          async
          defer
          data-domain="gmkit.vercel.app"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
