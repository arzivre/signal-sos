import fetcher from 'lib/fetcher'
import { useSession } from 'next-auth/react'
import { Suspense, useState } from 'react'
import useSWR from 'swr'
import { proxy, useSnapshot } from 'valtio'
import FormPeopleJoinSignal from './FormPeopleJoinSignal'
import Loader from './Loader'
import type { People, Signal } from '@prisma/client'

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
}) => {
  const { data: session } = useSession()

  const { data: people = [], error } = useSWR<[People]>(
    `/api/people/${id}`,
    fetcher
  )

  const isJoined: People | undefined = people.find(
    (data) => data.userId === session?.user?.id
  )

  if (!id) <Loader />
  if (error) return <div>failed to load</div>

  return (
    <div className='m-4 w-full border-4'>
      <Suspense fallback={<Loader />}>
        <h1 className='text-4xl'>{type}</h1>
        <p>{title}</p>
        <p>{author}</p>
        <p>{necessity}</p>
        <p>{location}</p>
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
      <section>
        <Suspense fallback={<Loader />}>
          {data.map((signal, index) => (
            <ul
              key={signal.id}
              onClick={() => selectIndex(index)}
              className='m-4 w-full border-4 hover:border-green-400'
            >
              <SignalCard {...signal} />
            </ul>
          ))}
        </Suspense>
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
      </section>

      <Suspense fallback={<Loader />}>
        <SignalDetailCard {...data[index]!} />
      </Suspense>
    </>
  )
}

export default SignalList
