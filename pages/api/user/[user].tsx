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
    // if (req.method === 'POST') {
    //   await createSignal(req, res)
    // }
    if (req.method === 'GET') {
      await getAllUserSignal(req, res)
    }
  } catch (error: any) {
    console.error(`Request error: [${error}]`)
    res.status(500).json({ message: error.message })
  }
}

// const createSignal = async (req: NextApiRequest, res: NextApiResponse) => {
//   const user = await prisma.signal.create({
//     data: {
//       id: cuid(),
//       ...req.body,
//     },
//   })
//   res.status(200).json(user)
// }

const getAllUserSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.headers['token'])
  const session = await getServerSession(req, res, nextAuthOptions)

  const user = await prisma.signal.findMany({
    where: {
      userId: session?.user?.id,
    },
  })

  res.status(200).json(user)
}
