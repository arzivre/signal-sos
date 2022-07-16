import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Loader from './Loader'

const Avatar = dynamic(() => import('./Avatar'), {
  suspense: true,
})

const Header = () => {
  const { data: session, status } = useSession()

  return (
    <div className='sticky top-0 bg-gray-100'>
      <header className='container mx-auto px-4 max-w-6xl'>
        <h1 className='mb-1 text-[calc(1em+2vh)] md:hidden'>Reach Signal</h1>

        <nav className='flex justify-between'>
          <h1 className='hidden text-[calc(1em+2vh)] md:block'>Reach Signal</h1>

          <ul className='flex gap-6 items-center'>
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
              {status === 'loading' && (
                // Removing this may cause hydration error
                <li>
                  <Loader />
                </li>
              )}

              {status === 'unauthenticated' ? (
                <li>
                  <button onClick={() => signIn()}>
                    Sign In to Create Signal
                  </button>
                </li>
              ) : (
                <Suspense fallback={<Loader />}>
                  <Avatar
                    name={
                      session?.user?.name || (session?.user?.email as string)
                    }
                  />
                </Suspense>
              )}
            </Suspense>
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default Header
