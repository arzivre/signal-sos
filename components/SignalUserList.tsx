import { Signal } from 'lib/types'
import fetcher from 'lib/fetcher'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import SignalCard from './SignalCard'

const SignalUserList = () => {
  const { data: session, status } = useSession()
  
  const { data, error } = useSWR<[Signal]>(`/api/user/1`, fetcher)

  if (error) return <div>failed to load</div>
  if (!data || status === 'loading') return <div>loading...</div>

  return (
    <section>
      {data.map((signal) => (
        <SignalCard key={signal.id} {...signal} />
      ))}
    </section>
  )
}
export default SignalUserList
