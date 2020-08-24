import '@app/styles/globals.css';
import 'prosemirror-view/style/prosemirror.css';
import { Provider as AuthProvider } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
