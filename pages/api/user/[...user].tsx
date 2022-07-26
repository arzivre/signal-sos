import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'lib/prisma'
import { unstable_getServerSession as getServerSession } from 'next-auth'
import { authOptions as nextAuthOptions } from '../auth/[...nextauth]'
import cuid from 'cuid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.headers['token'])

  try {
    //joined?&id=12
    //
    // }
    //   "query": {
    //   "id": "12",
    //   "user": [
    //     "joined"
    //   ]
    // }
    const userQuery = req.query.user?.toString()
    const idQuery = req.query.id?.toString()

    if (req.method === 'POST') {
      await createSignal(req, res)
    }
    if (req.method === 'GET') {
      if (userQuery === 'joined' && idQuery) {
        await getAllUserJoinedSignal(req, res)
      }

      await getAllUserSignal(req, res)
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

const getAllUserSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, nextAuthOptions)

  const userQuery = req.query.user?.toString()
  const pagination = Number(userQuery) * 4

  const user = await prisma.signal.findMany({
    skip: 1 * pagination,
    take: 4,
    orderBy: {
      id: 'desc',
    },
    where: {
      userId: session?.user?.id,
    },
  })

  res.status(200).json(user)
}

const getAllUserJoinedSignal = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, nextAuthOptions)

  const idQuery = req.query.id?.toString()
  const pagination = Number(idQuery) * 4

  const joinedSignal = await prisma.signal.findMany({
    skip: 1 * pagination,
    take: 4,
    orderBy: {
      id: 'desc',
    },
    where: {
      people: {
        some: {
          userId: session?.user?.id,
        },
      },
    },
  })

  res.status(200).json(joinedSignal)
}
