import { GetServerSideProps } from 'next'
import { getCsrfToken, signIn } from 'next-auth/react'
import Layout from 'src/components/Layout'
import { FcGoogle } from 'react-icons/fc'

export default function SignIn({ csrfToken }: { csrfToken: string }) {
  return (
    <>
      <Layout>
        <main
          role='main'
          className='container mx-auto my-20 grid max-w-xl grid-cols-1 rounded border-4
          border-black bg-hitam p-4 text-gray-50 md:p-8'
        >
          <button
            onClick={() => signIn('google')}
            className='w-full border-2 border-black bg-gray-50 px-4 py-3 
              text-gray-900 hover:bg-gray-400'
          >
            <span className='flex justify-center'>
              Sign in with Google <FcGoogle size={24} className='ml-2' />
            </span>
          </button>
          <br />
          <hr />
          <form
            method='post'
            action='/api/auth/signin/email'
            className='grid grid-cols-1 '
          >
            <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
            <label className='my-4'>
              <span className='mb-1 block'>Email address </span>
              <input type='email' id='email' name='email' className='w-full text-black' />
            </label>
            <button
              type='submit'
              className='border-2 border-black bg-gray-500 py-2 text-hitam hover:bg-white'
            >
              Sign in with Email
            </button>
          </form>
        </main>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}