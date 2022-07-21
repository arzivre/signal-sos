import Head from 'next/head'
import Header from './Header'

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
