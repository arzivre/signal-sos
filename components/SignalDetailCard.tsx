import fetcher from 'lib/fetcher'
import { Signal } from 'lib/types'
import useSWR from 'swr'
import FormPeopleJoinSignal from './FormPeopleJoinSignal'

const SignalDetailCard = () => {
  const { data, error } = useSWR<[Signal]>('/api/signal/123', fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  const { status, title, author, necessity, location, type, id } = data[0]

  return (
    <div className='w-full m-4 border-4'>
      <p>{id}</p>
      <h1 className='text-4xl'>{type}</h1>
      <p>{title}</p>
      <p>{author}</p>
      <p>{necessity}</p>
      <p>{location}</p>
      <FormPeopleJoinSignal {...data[0]} />
    </div>
  )
}

export default SignalDetailCard
