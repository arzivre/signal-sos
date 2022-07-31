import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/server/prisma'
import { unstable_getServerSession as getServerSession } from 'next-auth'
import { authOptions as nextAuthOptions } from '../auth/[...nextauth]'
import cuid from 'cuid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const userQuery = req.query.user?.toString()
    const idQuery = req.query.id?.toString()

    if (req.method === 'POST') {
      await createSignal(req, res)
    }
    
    if (req.method === 'PUT') {
      await updateSignal(req, res)
    }

    if (req.method === 'DELETE') {
      await deleteSignal(req, res)
    }

    if (req.method === 'GET') {
      await getAllUserSignal(req, res)
    }
  } catch (error: unknown) {
    console.error(`Request error: [${error}]`)
    res.status(500).json({ error: error })
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

const updateSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.signal.update({
    where: {
      id: req.query.user?.toString(),
    },
    data: {
      ...req.body,
    },
  })
  res.status(200).json(user)
}

const deleteSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.signal.delete({
    where: { id: req.query.user?.toString() },
  })
  res.status(202).json(user)
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

//joined?&id=12
//
// }
//   "query": {
//   "id": "12",
//   "user": [
//     "joined"
//   ]
// }
