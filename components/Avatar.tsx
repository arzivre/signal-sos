import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Suspense } from 'react'
import Loader from './Loader'

const Avatar: React.FC = () => {
  const { data: session, status } = useSession()
  const user = session?.user

  if (status === 'loading') {
    return (
      <li>
        <Loader />
      </li>
    )
  }
  if (status === 'unauthenticated') {
    return (
      <li>
        <button onClick={() => signIn()}>Sign In to Create Signal</button>
      </li>
    )
  }

  return (
    <>
      <li>
        <Link href='/user/create'>
          <a>Create Signal</a>
        </Link>
      </li>
      <li>
        <Link href='/user/signal'>
          <a>Your Signal</a>
        </Link>
      </li>

      <Suspense fallback={<Loader />}>
        <li>{user?.name || user?.email}</li>
      </Suspense>

      <li>
        <button onClick={() => signOut()}>sign Out</button>
      </li>
    </>
  )
}

export default Avatar
