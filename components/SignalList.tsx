import fetcher from 'lib/fetcher'
import { useSession } from 'next-auth/react'
import { Suspense } from 'react'
import useSWR from 'swr'
import { proxy, useSnapshot } from 'valtio'
import FormPeopleJoinSignal from './FormPeopleJoinSignal'
import Loader from './Loader'
import type { People, Signal } from '@prisma/client'

const state = proxy<{
  index: number
  selectIndex: (id: number) => void
}>({
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

  if (error) return <div>failed to load</div>

  return (
    <div className='w-full m-4 border-4'>
      <Suspense fallback={<Loader />}>
        <h1 className='text-4xl'>{type}</h1>
        <p>{title}</p>
        <p>{author}</p>
        <p>{necessity}</p>
        <p>{location}</p>
        <p>People</p>
        <ul className='grid grid-cols-[auto_auto_auto_auto]'>
          {people?.map(({ id, name }) => (
            <li key={id} title={name} className='px-4 rounded-sm'>
              <p>{name}</p>
            </li>
          ))}
        </ul>
        <p>Items Donated</p>
        <ul className='grid grid-cols-[auto_auto_auto_auto]'>
          {people?.map(({ id, items }) => (
            <li key={id} title={items} className='px-4 rounded-sm'>
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
}) => {
  return (
    <>
      <p>{type}</p>
      <p>{title}</p>
      <p>{author}</p>
      <p>{necessity}</p>
      <p>{location}</p>
    </>
  )
}

const SignalList = () => {
  const { data = [], error } = useSWR<[Signal]>('/api/signal/123', fetcher)
  const { index, selectIndex } = useSelectSignal()

  if (error) return <div>failed to load</div>

  return (
    <>
      <Suspense fallback={<Loader />}>
        <section>
          {data.map((signal, index) => (
            <div
              key={signal.id}
              onClick={() => selectIndex(index)}
              className='w-full m-4 border-4 hover:border-green-400'
            >
              <SignalCard {...signal} />
            </div>
          ))}
        </section>
      </Suspense>

      <Suspense fallback={<Loader />}>
        <SignalDetailCard {...data[index]!} />
      </Suspense>
    </>
  )
}

export default SignalList
