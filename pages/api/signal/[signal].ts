// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'lib/prisma'
import cuid from 'cuid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      await createSignal(req, res)
    }
    if (req.method === 'GET') {
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

const getAllSignal = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.signal?.toString()
  const user = await prisma.signal.findMany()

  res.status(200).json(user)
}
