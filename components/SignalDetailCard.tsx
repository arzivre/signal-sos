import fetcher from 'lib/fetcher'
import { People, Signal } from 'lib/types'
import { useSession } from 'next-auth/react'
import { Suspense } from 'react'
import useSWR from 'swr'
import FormPeopleJoinSignal from './FormPeopleJoinSignal'
import Loader from './Loader'

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

export default SignalDetailCard
