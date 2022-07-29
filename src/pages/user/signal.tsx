import type { Signal } from '@prisma/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Suspense, useState } from 'react'
import FormUpdateSignal from 'src/components/FormUpdateSignal'
import Layout from 'src/components/Layout'
import Loader from 'src/components/Loader'
import Pagination from 'src/components/Pagination'
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
  const [update, setUpdate] = useState<boolean>(false)
  const [dataIndex, setDataIndex] = useState<number>(0)

  const { data = [], error } = useSWR<[Signal]>(
    `/api/user/${paginationIndex}`,
    fetcher
  )

  if (error) return <div>failed to load</div>

  if (!data) return <div>loading...</div>

  return (
    <>
      <h2 className='mb-8 font-serif text-[calc(1em+2vw)]'>Your Signal</h2>

      <section className='grid grid-cols-1'>
        {data.map((signal, index) => (
          <>
            <div key={signal.id} className='m-4 border-4'>
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
              <button>delete</button>
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
