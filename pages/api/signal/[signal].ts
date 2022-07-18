// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'lib/prisma'
import { unstable_getServerSession as getServerSession } from 'next-auth'
import { authOptions as nextAuthOptions } from '../auth/[...nextauth]'
import cuid from 'cuid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const signal = req.query.signal?.toString()

    if (req.method === 'POST') {
      if (signal === 'join-signal') {
        await joinSignal(req, res)
      }
      await createSignal(req, res)
    }
    if (req.method === 'GET') {
      if (signal === 'get-first-item') {
        await getFirstSignal(req, res)
      }
      if (signal === 'get-detail-signal') {
        await getDetailSignal(req, res)
      }
      await getAllSignal(req, res)
    }
  } catch (error: any) {
    console.error(`Request error: [${error}]`)
    res.status(500).json({ message: error.message })
  }
}

const createSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.signal.create({
    data: {
      id: cuid(),
      ...req.body,
    },
  })
  res.status(200).json(user)
}

const joinSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, nextAuthOptions)

  const user = await prisma.people.create({
    data: {
      id: cuid(),
      userId: session?.user?.id,
      ...req.body,
    },
  })
  res.status(200).json(user)
}

const getAllSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const signal = await prisma.signal.findMany()

  res.status(200).json(signal)
}

const getFirstSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.signal?.toString()
  const signal = await prisma.signal.findFirst({
    orderBy: {
      created_at: 'desc',
    },
  })
  res.status(200).json(signal)
}

const getDetailSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const signal = await prisma.signal.findUnique({
    where: {
      id: req.headers['token']?.toString(),
    },
  })
  res.status(200).json(signal)
}
