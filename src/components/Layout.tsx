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

const Header = () => {
  return (
    <div className='sticky top-0 bg-gray-100'>
      <header className='container mx-auto max-w-7xl px-4'>
        <h1 className='mb-1 text-[calc(1em+2vh)] md:hidden'>Reach Signal</h1>

        <nav className=''>
          <h1 className='hidden text-[calc(1em+2vh)] md:block'>Reach Signal</h1>
          <ul className='grid grid-cols-[1fr_auto] whitespace-nowrap md:flex md:justify-start gap-x-6'>
            <li>
              <Link href='/'>
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href='/about'>
                <a>About</a>
              </Link>
            </li>

            <Suspense fallback={<Loader />}>
              <User />
            </Suspense>
          </ul>
        </nav>
      </header>
    </div>
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
