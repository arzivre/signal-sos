import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'src/server/prisma'
import { unstable_getServerSession as getServerSession } from 'next-auth'
import { authOptions as nextAuthOptions } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const getQuery = req.query.get?.toString()
    const idQuery = req.query.id?.toString()

    if (req.method === 'GET') {
      await getAllUserJoinedSignal(req, res)
    }
  } catch (error: unknown) {
    console.error(`Request error: [${error}]`)
    res.status(500).json({ error: error })
  }
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
    include: {
      people: true,
    },
  })

  res.status(200).json(joinedSignal)
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
