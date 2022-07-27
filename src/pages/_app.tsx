import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import 'src/styles/globals.css'

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
