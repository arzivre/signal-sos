import cuid from 'cuid'
import { prisma } from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession as getServerSession } from 'next-auth'
import { authOptions as nextAuthOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.headers['token'])
  let people = req.query.people as string

  try {
    if (req.method === 'GET') {
      await getAllPeopleJoinSignal(req, res, people as string)
    }
    if (req.method === 'POST') {
      await peopleJoinSignal(req, res, people)
    }
  } catch (error: any) {
    console.error(`Request error: [${error}]`)
    res.status(500).json({ message: error.message })
  }
}

const getAllPeopleJoinSignal = async (
  req: NextApiRequest,
  res: NextApiResponse,
  people?: string
) => {
  const data = await prisma.people.findMany({
    where: {
      signalId: people,
    },
  })
  res.status(200).json(data)
}

const peopleJoinSignal = async (
  req: NextApiRequest,
  res: NextApiResponse,
  people?: string
) => {
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
