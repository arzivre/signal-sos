import autoAnimate from '@formkit/auto-animate'
import type { Signal } from '@prisma/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import FormUpdateSignal from 'src/components/FormUpdateSignal'
import Layout from 'src/components/Layout'
import Loader from 'src/components/Loader'
import Pagination from 'src/components/Pagination'
import fetcher from 'src/server/fetcher'
import useSWR, { mutate } from 'swr'

const UserCreatedSignal = () => {
  const [paginationIndex, setPaginationIndex] = useState(0)
  const [update, setUpdate] = useState<boolean>(false)
  const [dataIndex, setDataIndex] = useState<number>(0)

  const parent = useRef(null)

  const { data = [], error } = useSWR<[Signal]>(
    `/api/user/${paginationIndex}`,
    fetcher
  )

  const deleteSignal = async (id: string) => {
    await fetch(`/api/user/${id}`, { method: 'DELETE' })
    mutate(`/api/user/${id}`)
  }

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  if (error) return <div>failed to load</div>

  if (!data) return <div>loading...</div>

  return (
    <>
      <section className='grid grid-cols-1'>
        {data.map((signal, index) => (
          <>
            <div ref={parent} key={signal.id} className='m-4 border-4'>
              <p>{signal.title}</p>
              <p>{signal.author}</p>
              <p>{signal.necessity}</p>
              <p>{signal.location}</p>
              <button
                onClick={() => {
                  setDataIndex(index), setUpdate(true)
                }}
              >
                update
              </button>
              <button onClick={() => deleteSignal(signal.id)}>delete</button>
              {update && index === dataIndex && (
                <FormUpdateSignal data={signal} setUpdate={setUpdate} />
              )}
            </div>
          </>
        ))}
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
        <main role='main' className='container mx-auto my-10'>
          <h1 className='mb-8 font-serif text-[calc(1em+3vw)]'>Your Signal</h1>

          <div className='flex justify-evenly'>
            <Link href={'/user/signal'}>
              <button>Your Signal</button>
            </Link>
            <Link href={'/user/joined-signal'}>
              <button>Joined Signal</button>
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
