import type { People, Signal } from '@prisma/client'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Suspense, useState } from 'react'
import FormPeopleJoinSignal from 'src/components/FormPeopleJoinSignal'
import Layout from 'src/components/Layout'
import Loader from 'src/components/Loader'
import Pagination from 'src/components/Pagination'
import fetcher from 'src/server/fetcher'
import useSWR from 'swr'
import { proxy, useSnapshot } from 'valtio'

const LazyMap = dynamic(() => import('src/components/Map'), { ssr: false })

interface StateProps {
  index: number
  selectIndex: (id: number) => void
}
const state = proxy<StateProps>({
  index: 0,
  selectIndex: (id: number) => {
    state.index = id
  },
})

function useSelectSignal() {
  return useSnapshot(state)
}

const SignalDetailCard: React.FC<Signal> = (props) => {
  const { data: session } = useSession()

  const { data: people = [], error } = useSWR<[People]>(
    `/api/people/${props.id}`,
    fetcher
  )

  const isJoined: People | undefined = people.find(
    (data) => data.userId === session?.user?.id
  )

  if (!props.id) return <Loader />

  if (error) return <div>failed to load</div>

  return (
    <div
      className='mx-auto w-full rounded border-4 border-black bg-[#16161a] px-8 
      text-xl font-semibold text-gray-500'
    >
      <Suspense fallback={<Loader />}>
        <h1
          className={`py-6 text-center text-5xl 
        ${props.type === 'sos' ? 'text-orange-500' : 'text-green-500'}`}
        >
          {props.type.toUpperCase()}
        </h1>
        {props.lat && props.long && (
          <LazyMap position={[Number(props.lat), Number(props.long)]} />
        )}
        <h2 className='my-2 text-4xl text-white'>{props.title}</h2>
        <p>Author: {props.author}</p>
        <p>Necessity: {props.necessity}</p>
        <p>Location: {props.location}</p>
        <p className='mt-2 text-gray-200'>People Joined</p>
        <ul className='grid grid-cols-[auto_auto_auto_auto]'>
          {people?.map(({ id, name }) => (
            <li key={id} title={name} className='rounded-sm px-4'>
              <p>{name}</p>
            </li>
          ))}
        </ul>
        <p className='mt-2 text-gray-200'>Items Donated</p>
        <ul className='grid grid-cols-[auto_auto_auto_auto]'>
          {people?.map(({ id, items }) => (
            <li key={id} title={items} className='rounded-sm px-4'>
              <p>{items}</p>
            </li>
          ))}
        </ul>
        <FormPeopleJoinSignal
          id={props.id}
          type={props.type}
          isJoined={isJoined}
        />
      </Suspense>
    </div>
  )
}

export const SignalCard: React.FC<Signal> = (props) => {
  return (
    <div className='grid grid-cols-[1fr_auto]'>
      <div
        className={`text-lg font-semibold ${
          props.type === 'sos' ? 'text-gray-100' : 'text-gray-900'
        }`}
      >
        <p
          className={`mb-1 text-2xl text-gray-50
        ${props.type === 'sos' ? null : 'text-gray-900'}`}
        >
          {props.title}
        </p>
        <p>Author: {props.author}</p>
        <p>Location: {props.location}</p>
        <p>Necessity: {props.necessity}</p>
      </div>
      <div className='grid grid-rows-[1fr_auto_1fr]'>
        <div />
        <p
          className={`mr-4 p-2 text-right text-[calc(1em+1vw)] font-bold text-slate-900 
          ${props.type === 'sos' ? null : 'text-green-500'}
          `}
        >
          {props.type.toUpperCase()}
        </p>
        <div />
      </div>
    </div>
  )
}

const SignalList = () => {
  const { index, selectIndex } = useSelectSignal() //* Valtio Global State
  const [paginationIndex, setPaginationIndex] = useState(0)

  const { data = [], error } = useSWR<[Signal]>(
    `/api/signal/${paginationIndex}`,
    fetcher,
    { refreshInterval: 2000, dedupingInterval: 2000 }
  )

  if (error) return <div>failed to load</div>

  return (
    <>
      <section className='mx-4 '>
        <Suspense fallback={<Loader />}>
          <ul>
            {data.map((signal, index) => (
              <li
                key={signal.id}
                onClick={() => selectIndex(index)}
                className={`mx-auto mb-4 w-full rounded border-4 border-black p-4 
                hover:border-green-400 
                ${
                  signal.type === 'sos'
                    ? 'bg-[#7f5af0] text-gray-50'
                    : 'bg-green-200 text-gray-900'
                }`}
              >
                <SignalCard {...signal} />
              </li>
            ))}
          </ul>
          <Pagination
            state={paginationIndex}
            setState={setPaginationIndex}
            dataLength={data.length}
          />
        </Suspense>
      </section>

      <Suspense fallback={<Loader />}>
        <SignalDetailCard {...data[index]!} />
      </Suspense>
    </>
  )
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Layout>
        <main
          role='main'
          className='container my-10 mx-auto grid grid-cols-1 p-4 md:grid-cols-2 md:gap-8'
        >
          <SignalList />
        </main>
      </Layout>
    </>
  )
}

export default Home
