import type { Signal } from '@prisma/client'
import Layout from 'src/components/Layout'
import Loader from 'src/components/Loader'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { Suspense, useState } from 'react'
import useSWR from 'swr'

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)
  return res.json()
}

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

const UserJoinedSignal = () => {
  const [indexJoinedSignal, setIndexJoinedSignal] = useState(0)

  const { data = [], error } = useSWR<[Signal]>(
    `/api/user/joined?&id=${indexJoinedSignal}`,
    fetcher
  )

  if (error) return <div>failed to load</div>

  if (!data) return <div>loading...</div>
  return (
    <>
      <h2 className='mb-8 font-serif text-[calc(1em+2vw)]'>Joined Signal</h2>

      {data.length > 0 ? (
        <>
          <section className='grid grid-cols-2 md:gap-x-8'>
            {data.map((signal) => (
              <SignalCard key={signal.id} {...signal} />
            ))}
          </section>
          <div className='mx-4  grid grid-cols-[1fr_auto_1fr] text-center'>
            {indexJoinedSignal > 0 ? (
              <button
                onClick={() => setIndexJoinedSignal(indexJoinedSignal - 1)}
              >
                Previous
              </button>
            ) : (
              <div />
            )}
            {indexJoinedSignal > 0 ? (
              <p> {indexJoinedSignal + 1} </p>
            ) : (
              <p>1</p>
            )}
            {data.length > 0 && (
              <button
                disabled={data.length === 0}
                onClick={() => setIndexJoinedSignal(indexJoinedSignal + 1)}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div>
          <p>No Data</p>
          {indexJoinedSignal > 0 ? (
            <button onClick={() => setIndexJoinedSignal(indexJoinedSignal - 1)}>
              Go Back
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </>
  )
}

const UserCreatedSignal = () => {
  const [paginationIndex, setPaginationIndex] = useState(0)

  const { data = [], error } = useSWR<[Signal]>(
    `/api/user/${paginationIndex}`,
    fetcher
  )

  if (error) return <div>failed to load</div>

  if (!data) return <div>loading...</div>

  return (
    <>
      <h2 className='mb-8 font-serif text-[calc(1em+2vw)]'>Yuor Signal</h2>

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
        {data.length > 0 && (
          <button
            disabled={data.length === 0}
            onClick={() => setPaginationIndex(paginationIndex + 1)}
          >
            Next
          </button>
        )}
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
        <main role='main' className='container mx-auto'>
          <h1 className='mb-8 font-serif text-[calc(1em+3vw)]'>User Signal</h1>
          <Suspense fallback={<Loader />}>
            <Suspense fallback={<Loader />}>
              <UserJoinedSignal />
            </Suspense>

            <Suspense fallback={<Loader />}>
              <UserCreatedSignal />
            </Suspense>
          </Suspense>
        </main>
      </Layout>
    </>
  )
}

export default UserSignalPage
