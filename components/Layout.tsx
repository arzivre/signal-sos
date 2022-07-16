import Header from './Header'
import Head from 'next/head'
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>reach signal</title>
      </Head>

      <Header />
      {children}
    </>
  )
}

export default Layout
