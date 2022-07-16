import Link from 'next/link'
import { signOut } from 'next-auth/react'
import Loader from './Loader'

const Avatar: React.FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <li>{name}</li>
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
      <li>
        <button onClick={() => signOut()}>sign Out</button>
      </li>
    </>
  )
}

export default Avatar
