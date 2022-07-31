import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { Suspense } from 'react'
import Loader from './Loader'

const User: React.FC = () => {
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
        <Link href='/signin'>
          <a>Sign In to Create Signal</a>
        </Link>
      </li>
    )
  }

  return (
    <>
      <li>
        <Link href='/user/create'>
          <a className='hover:underline'>Create Signal</a>
        </Link>
      </li>
      <li>
        <Link href='/user/signal'>
          <a className='hover:underline'>Your Signal</a>
        </Link>
      </li>

      <Suspense fallback={<Loader />}>
        <li>{user?.name || user?.email}</li>
      </Suspense>
      <br />
      <li className='w-full'>
        <button
          onClick={() => signOut()}
          className='hover:text-rose-600 hover:underline'
        >
          sign Out
        </button>
      </li>
    </>
  )
}

const Header = () => {
  return (
    <header className='container mx-auto max-w-7xl px-4 text-2xl text-gray-50'>
      <Link href='/'>
        <a className='hover:underline'>
          <h1 className='my-4 font-serif text-[calc(1em+2vh)] md:hidden'>
            Signal <span className='text-orange-600'> SOS</span>
          </h1>
        </a>
      </Link>

      <nav className=''>
        <Link href='/'>
          <a className='hover:underline'>
            <h1 className='my-4 hidden font-serif text-[calc(1em+2vh)] md:block'>
              Signal
              <span className='text-orange-600'> SOS</span>
            </h1>
          </a>
        </Link>
        <ul className='grid grid-cols-2 gap-x-6 gap-y-2 whitespace-nowrap md:flex md:justify-start'>
          <li>
            <Link href='/'>
              <a className='hover:underline'>Home</a>
            </Link>
          </li>
          <li>
            <Link href='/about'>
              <a className='hover:underline'>About</a>
            </Link>
          </li>

          <Suspense fallback={<Loader />}>
            <User />
          </Suspense>
        </ul>
      </nav>
    </header>
  )
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>signal sos</title>
      </Head>

      <Header />
      {children}
    </>
  )
}

export default Layout
