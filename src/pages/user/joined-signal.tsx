import type { Signal } from '@prisma/client'
import Link from 'next/link'
import { useState } from 'react'
import Layout from 'src/components/Layout'
import Pagination from 'src/components/Pagination'
import fetcher from 'src/server/fetcher'
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

const JoinedSignalPage = () => {
  const [indexJoinedSignal, setIndexJoinedSignal] = useState(0)

  const { data = [], error } = useSWR<[Signal]>(
    `/api/joined/get?&id=${indexJoinedSignal}`,
    fetcher
  )

  if (error) return <div>failed to load</div>

  if (!data) return <div>loading...</div>

  return (
    <Layout>
      <main className='container mx-auto my-10 min-h-full'>
        <h1 className='mb-8 font-serif text-[calc(1em+3vw)]'>Joined Signal</h1>
        <div className='flex justify-evenly'>
          <Link href={'/user/signal'}>
            <button>Your Signal</button>
          </Link>
          <Link href={'/user/joined-signal'}>
            <button>Joined Signal</button>
          </Link>
        </div>
        {data.length > 0 ? (
          <>
            <section className='grid grid-cols-2 md:gap-x-8'>
              {data.map((signal) => (
                <SignalCard key={signal.id} {...signal} />
              ))}
            </section>
            <Pagination
              state={indexJoinedSignal}
              setState={setIndexJoinedSignal}
              dataLength={data.length}
            />
          </>
        ) : (
          <div>
            <p>No Data</p>
            {indexJoinedSignal > 0 ? (
              <button
                onClick={() => setIndexJoinedSignal(indexJoinedSignal - 1)}
              >
                Go Back
              </button>
            ) : (
              <div />
            )}
          </div>
        )}
      </main>
    </Layout>
  )
}

export default JoinedSignalPage
