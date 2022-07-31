import { Dispatch, SetStateAction } from 'react'

interface PaginationProps {
  state: number
  setState: Dispatch<SetStateAction<number>>
  dataLength: number
}

const Pagination: React.FC<PaginationProps> = ({
  state,
  setState,
  dataLength,
}) => {
  return (
    <div
      className='grid grid-cols-[1fr_auto_1fr] 
      rounded border-4 border-black bg-[#72757e] p-4 text-center text-xl text-gray-900'
    >
      {state > 0 ? (
        <button
          className='hover:underline w-full'
          onClick={() => setState(state - 1)}
        >
          Previous Page
        </button>
      ) : (
        <div />
      )}
      {state > 0 ? <p> {state + 1} </p> : null}
      {dataLength === 0 ? (
        <h3>Thats all we got</h3>
      ) : (
        <button
          className='hover:underline w-full'
          disabled={dataLength === 0}
          onClick={() => setState(state + 1)}
        >
          Next Page
        </button>
      )}
    </div>
  )
}

export default Pagination
