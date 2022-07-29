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
    <div className='mx-4  grid grid-cols-[1fr_auto_1fr] text-center'>
      {state > 0 ? (
        <button onClick={() => setState(state - 1)}>Previous Page</button>
      ) : (
        <div />
      )}
      {state > 0 ? <p> {state + 1} </p> : <p>1</p>}
      {dataLength === 0 ? (
        <h3>No Data Left Go Back Previous Page</h3>
      ) : (
        <button disabled={dataLength === 0} onClick={() => setState(state + 1)}>
          Next Page
        </button>
      )}
    </div>
  )
}

export default Pagination
