import autoAnimate from '@formkit/auto-animate'
import type { Signal } from '@prisma/client'
import type { NextPage } from 'next'
import { useSession, signIn } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import FormUpdateSignal from 'src/components/FormUpdateSignal'
import Layout from 'src/components/Layout'
import Loader from 'src/components/Loader'
import Pagination from 'src/components/Pagination'
import fetcher from 'src/server/fetcher'
import useSWR, { mutate } from 'swr'
import { SignalCard } from '..'

const LazyMap = dynamic(() => import('src/components/Map'), { ssr: false })

const UserCreatedSignal = () => {
  const { status } = useSession()

  const [paginationIndex, setPaginationIndex] = useState(0)
  const [update, setUpdate] = useState<boolean>(false)
  const [dataIndex, setDataIndex] = useState<number>(0)

  const parent = useRef(null)

  const { data = [], error } = useSWR<[Signal]>(
    `/api/user/${paginationIndex}`,
    fetcher
  )

  const deleteSignal = async (id: string) => {
    if (confirm('Are you sure you want to delete?')) {
      await fetch(`/api/user/${id}`, { method: 'DELETE' })
      mutate(`/api/user/${id}`)
    }
  }

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

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
    <>
      <section className='my-4 grid grid-cols-1'>
        <ul>
          {data.map((signal, index) => (
            <>
              <div className='grid grid-cols-[1fr_auto]'>
                <li
                  key={signal.id}
                  className={`mx-auto mb-4 w-full rounded p-4 hover:border-green-400 ${
                    signal.type === 'sos'
                      ? 'bg-[#7f5af0] text-gray-50'
                      : 'bg-green-200 text-gray-900'
                  }`}
                >
                  {signal.lat && signal.long && (
                    <LazyMap
                      position={[Number(signal.lat), Number(signal.long)]}
                    />
                  )}
                  <SignalCard {...signal} />
                  {update && index === dataIndex && (
                    <FormUpdateSignal data={signal} setUpdate={setUpdate} />
                  )}
                </li>
                <div className='mb-4 ml-4 grid grid-cols-1 font-semibold '>
                  <button
                    onClick={() => {
                      setDataIndex(index), setUpdate(true)
                    }}
                    className='rounded-t bg-blue-600 px-4 py-2 text-white hover:bg-blue-900'
                  >
                    update
                  </button>
                  <button
                    onClick={() => deleteSignal(signal.id)}
                    className='rounded-b bg-rose-100/10 px-4 py-2 text-rose-600 hover:bg-rose-900 hover:text-rose-50'
                  >
                    delete
                  </button>
                </div>
              </div>
            </>
          ))}
        </ul>
      </section>
      <Pagination
        state={paginationIndex}
        setState={setPaginationIndex}
        dataLength={data.length}
      />
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
        <main
          role='main'
          className='container mx-auto my-10 rounded bg-hitam p-4 text-gray-50 md:p-8'
        >
          <h1 className='mb-8 font-serif text-[calc(1em+3vw)] text-white'>
            Your Signal
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

          <Suspense fallback={<Loader />}>
            <UserCreatedSignal />
          </Suspense>
        </main>
      </Layout>
    </>
  )
}

export default UserSignalPage
