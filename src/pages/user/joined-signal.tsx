import type { People, Signal } from '@prisma/client'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import Layout from 'src/components/Layout'
import Pagination from 'src/components/Pagination'
import fetcher from 'src/server/fetcher'
import useSWR from 'swr'
import { SignalCard } from '..'

type SignalAndPeople = Signal & {
  people: [People]
}
const JoinedSignalPage = () => {
  const { status } = useSession()

  const [indexJoinedSignal, setIndexJoinedSignal] = useState(0)

  const { data = [], error } = useSWR<[SignalAndPeople]>(
    `/api/joined/get?&id=${indexJoinedSignal}`,
    fetcher
  )

  if (error) return <div>failed to load</div>

  if (!data) return <div>loading...</div>

  if (status === 'unauthenticated')
    return (
      <button
        onClick={() => signIn()}
        className='text-center text-xl text-white hover:underline'
      >
        Sign In
      </button>
    )

  return (
    <Layout>
      <main className='container mx-auto my-10 min-h-full rounded bg-hitam p-4 md:p-8'>
        <h1 className='mb-8 font-serif text-[calc(1em+3vw)] text-white'>
          Joined Signal
        </h1>
        <div className='flex justify-evenly rounded text-lg font-semibold'>
          <Link href={'/user/signal'}>
            <button className='my-4 w-full rounded-l bg-green-900 p-4 hover:underline'>
              Your Signal
            </button>
          </Link>
          <Link href={'/user/joined-signal'}>
            <button className='my-4 w-full rounded-r bg-purple-900 p-4 hover:underline'>
              Joined Signal
            </button>
          </Link>
        </div>
        {data.length > 0 ? (
          <>
            <section className='grid grid-cols-1 text-xl font-semibold md:gap-x-8'>
              <ul>
                {data.map((signal) => (
                  <li
                    key={signal.id}
                    className={`mx-auto mb-4 w-full rounded p-4 hover:border-green-400 ${
                      signal.type === 'sos'
                        ? 'bg-[#7f5af0] text-gray-50'
                        : 'bg-green-200 text-gray-900'
                    }`}
                  >
                    <SignalCard {...signal} />
                    <p>People joined</p>
                    <ul className='grid grid-cols-[auto_auto_auto_auto]'>
                      {signal.people?.map(({ id, name }) => (
                        <li key={id} title={name} className='rounded-sm px-4'>
                          <p>{name}</p>
                        </li>
                      ))}
                    </ul>
                    <p>Items Donated</p>
                    <ul className='grid grid-cols-[auto_auto_auto_auto]'>
                      {signal.people?.map(({ id, items }) => (
                        <li key={id} className='rounded-sm px-4'>
                          <p>{items}</p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
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
