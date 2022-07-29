import { useSession } from 'next-auth/react'
import { Suspense, useState } from 'react'
import useSWR from 'swr'
import { proxy, useSnapshot } from 'valtio'
import FormPeopleJoinSignal from './FormPeopleJoinSignal'
import Loader from './Loader'
import type { People, Signal } from '@prisma/client'
import dynamic from 'next/dynamic'
import Pagination from './Pagination'
import fetcher from 'src/server/fetcher'

const LazyMap = dynamic(
  () => {
    return import('src/components/Map')
  },
  { ssr: false }
)

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

const SignalDetailCard: React.FC<Signal> = ({
  title,
  author,
  necessity,
  location,
  type,
  id,
  lat,
  long,
}) => {
  const { data: session } = useSession()

  const { data: people = [], error } = useSWR<[People]>(
    `/api/people/${id}`,
    fetcher
  )

  const isJoined: People | undefined = people.find(
    (data) => data.userId === session?.user?.id
  )

  if (!id) return <Loader />

  if (error) return <div>failed to load</div>

  return (
    <div className='mx-auto w-full border-4 px-4'>
      <Suspense fallback={<Loader />}>
        {lat && long && <LazyMap position={[Number(lat), Number(long)]} />}
        <h1 className='text-4xl'>{type}</h1>
        <p>{title}</p>
        <p>{author}</p>
        <p>{necessity}</p>
        <p>{location}</p>
        <p>
          Latidude: {lat}, Longitude:{long}
        </p>
        <p>People Joined</p>
        <ul className='grid grid-cols-[auto_auto_auto_auto]'>
          {people?.map(({ id, name }) => (
            <li key={id} title={name} className='rounded-sm px-4'>
              <p>{name}</p>
            </li>
          ))}
        </ul>
        <p>Items Donated</p>
        <ul className='grid grid-cols-[auto_auto_auto_auto]'>
          {people?.map(({ id, items }) => (
            <li key={id} title={items} className='rounded-sm px-4'>
              <p>{items}</p>
            </li>
          ))}
        </ul>
        <FormPeopleJoinSignal id={id} type={type} isJoined={isJoined} />
      </Suspense>
    </div>
  )
}

const SignalCard: React.FC<Signal> = ({
  title,
  author,
  necessity,
  location,
  type,
  id,
}) => {
  return (
    <li>
      <p>{id}</p>
      <p>{type}</p>
      <p>{title}</p>
      <p>{author}</p>
      <p>{necessity}</p>
      <p>{location}</p>
    </li>
  )
}

const SignalList = () => {
  const [paginationIndex, setPaginationIndex] = useState(0)
  const { index, selectIndex } = useSelectSignal() //* Valtio Global State

  const { data = [], error } = useSWR<[Signal]>(
    `/api/signal/${paginationIndex}`,
    fetcher
  )

  if (error) return <div>failed to load</div>

  return (
    <>
      <section className='mx-4'>
        <Suspense fallback={<Loader />}>
          {data.map((signal, index) => (
            <ul
              key={signal.id}
              onClick={() => selectIndex(index)}
              className='mx-auto w-full border-4 px-4 hover:border-green-400'
            >
              <SignalCard {...signal} />
            </ul>
          ))}
        </Suspense>
        <Pagination
          state={paginationIndex}
          setState={setPaginationIndex}
          dataLength={data.length}
        />
      </section>

      <Suspense fallback={<Loader />}>
        <SignalDetailCard {...data[index]!} />
      </Suspense>
    </>
  )
}

export default SignalList
