import { PrismaClient, PrismaClientValidationError, Session } from '@prisma/client';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { serializeDates } from './serialize-dates';

interface Context {
  req: NextApiRequest
  prisma: PrismaClient;
  userId: number;
}

type Handler = (ctx: Context) => object | Promise<object>;

export function handler(cb: Handler): NextApiHandler {
  return async (req, res) => {
    const prisma = new PrismaClient();
    try {
      const session = await authenticate(req);
      const { userId} = await prisma.session.findOne({ where: { accessToken: session.accessToken }})
      const responseData = await cb({ req, prisma, userId });
      console.log({ session })
      res.status(200).json(serializeDates(responseData))
    } catch (error) {
      await handleError(req, res, error);
    } finally {
      prisma.$disconnect();
    }
  };
}

async function handleError(
  req: NextApiRequest,
  res: NextApiResponse,
  error: Error
) {
  let status = 500;

  if (error instanceof HttpError) {
    status = error?.status || 500;
  }

  console.log(error);

  res.status(status).json({ ...error });
}

interface NextAuthSession {
  accessToken: string
  expires: string
  user: {
    name?: string
    email?: string
    image?: string
  }
}

async function authenticate(req: NextApiRequest) {
  const session: NextAuthSession = await getSession({ req });

  if (!session) {
    throw new UnauthenticatedError();
  }

  return session;
}

export class HttpError extends Error {
  status: number;
}

export class UnauthenticatedError extends HttpError {
  status = 401;
  constructor() {
    super('Unauthenticated');
  }
}

export class NotImplementedError extends HttpError {
  status = 501
  constructor() {
    super('Not Implemented')
  }
}