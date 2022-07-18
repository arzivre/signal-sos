import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Loader from './Loader'

const Avatar = dynamic(() => import('./Avatar'), {
  suspense: true,
})

const Header = () => {
  return (
    <div className='sticky top-0 bg-gray-100'>
      <header className='container mx-auto px-4 max-w-6xl'>
        <h1 className='mb-1 text-[calc(1em+2vh)] md:hidden'>Reach Signal</h1>

        <h1 className='hidden text-[calc(1em+2vh)] md:block'>Reach Signal</h1>
        <nav className='flex justify-between'>
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
              <Avatar />
            </Suspense>
          </ul>
        </nav>
      </header>
    </div>
  )
}

export default Header
