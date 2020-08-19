import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

export function requireAuth(callback: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const session = await getSession({ req });
    if (session) {
      callback(req, res);
    } else {
      // Not Signed in
      res.status(401);
      res.json({ status: 401, message: 'Unauthenticated' });
    }
  };
}
