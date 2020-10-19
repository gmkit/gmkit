import { useSession } from 'next-auth/client';
import { AccessDenied } from './access-denied';
import { LoadingScreen } from './loading-screen';

export function AuthenticationRequired({ children }) {
  const [session, loading] = useSession();

  if (loading) return <LoadingScreen />;

  if (!loading && !session) return <AccessDenied />;

  return children;
}
