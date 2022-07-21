import useSelectSignal from 'hooks/useSelectSignal'
import fetcher from 'lib/fetcher'
import { Signal } from 'lib/types'
import { Suspense } from 'react'
import useSWR from 'swr'
import Loader from './Loader'
import SignalDetailCard from './SignalDetailCard'

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
