import type { Signal } from '@prisma/client'
import Layout from 'components/Layout'
import Loader from 'components/Loader'
import fetcher from 'lib/fetcher'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { Suspense, useState } from 'react'
import useSWR from 'swr'

const SignalCard = ({ title, author, necessity, location }: Signal) => {
  return (
    <div className='m-4 border-4'>
      <p>{title}</p>
      <p>{author}</p>
      <p>{necessity}</p>
      <p>{location}</p>
    </div>
  )
}

const SignalUserList = () => {
  const [paginationIndex, setPaginationIndex] = useState(0)
  const { data: session, status } = useSession()

  const { data = [], error } = useSWR<[Signal]>(
    `/api/user/${paginationIndex}`,
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!data || status === 'loading') return <div>loading...</div>

  return (
    <>
      <section className='grid grid-cols-2 md:gap-x-8'>
        {data.map((signal) => (
          <SignalCard key={signal.id} {...signal} />
        ))}
      </section>
      <div className='mx-4  grid grid-cols-[1fr_auto_1fr] text-center'>
        {paginationIndex > 0 ? (
          <button onClick={() => setPaginationIndex(paginationIndex - 1)}>
            Previous
          </button>
        ) : (
          <div />
        )}
        {paginationIndex > 0 ? <p> {paginationIndex + 1} </p> : <p>1</p>}
        <button
          disabled={data.length === 0}
          onClick={() => setPaginationIndex(paginationIndex + 1)}
        >
          Next
        </button>
      </div>
    </>
  )
}

const UserSignalPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>User Signal - Reach Signal</title>
      </Head>

      <Layout>
        <main className='container mx-auto'>
          <h1 className='mb-8 font-serif text-[calc(1em+8vh)]'>Signal</h1>
          <Suspense fallback={<Loader />}>
            <SignalUserList />
          </Suspense>
        </main>
      </Layout>
    </>
  )
}

export default UserSignalPage
