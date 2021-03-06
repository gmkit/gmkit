import { PrismaClient, Session } from '@prisma/client';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { serializeDates } from './serialize-dates';

interface Context {
  prisma: PrismaClient;
  session: Session;
}

type Handler = (
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: Context
) => object | Promise<object>;

export function handler(cb: Handler): NextApiHandler {
  return async (req, res) => {
    const prisma = new PrismaClient();
    try {
      const session = await authenticate(req);
      const responseData = await cb(req, res, { prisma, session });
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

async function authenticate(req: NextApiRequest) {
  const session = await getSession({ req });
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
