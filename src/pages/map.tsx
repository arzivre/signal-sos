import dynamic from 'next/dynamic'

const LazyMap = dynamic(() => {return import('src/components/Map') },
  { ssr: false }
)

const map = () => {
  return (
    <div className='container mx-auto'>
      <h1>
        Tes Map
      </h1>
      <LazyMap />
    </div>
  )
}

export default map
