import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import { Button } from './button';

export default function AuthButtons() {
  const [session, loading] = useSession();

  if (loading) {
    return <span>Checking Session</span>
  }

  if (!session) {
    return (<div>
      <Button onClick={signIn}>Sign in</Button>
    </div>)
  }

  const user = session?.user
  const displayName = user.name || user.email
  return (
    <div>
      {displayName ? `Signed in as ${displayName}` : null} {" "}
      <Button onClick={signOut}>Sign out</Button>
    </div>
  );
}

