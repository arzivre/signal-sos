import type { Signal } from '@prisma/client'
import fetcher from 'lib/fetcher'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

const SignalCard = ({ title, author, necessity, location }: Signal) => {
  return (
    <div className='w-full m-4 border-4'>
      <p>{title}</p>
      <p>{author}</p>
      <p>{necessity}</p>
      <p>{location}</p>
    </div>
  )
}

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
