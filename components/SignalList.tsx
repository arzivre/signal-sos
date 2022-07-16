import { Signal } from 'lib/types'
import SignalCard from './SignalCard'
import useSWR from 'swr'
import fetcher from 'lib/fetcher'

const SignalList = () => {
  const { data, error } = useSWR<[Signal]>('/api/signal/123', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <section>
      {data.map((signal: Signal) => (
        <SignalCard key={signal.id} {...signal} />
      ))}
    </section>
  )
}

export default SignalList
