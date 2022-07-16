import { Signal } from 'lib/types'

const SignalCard = ({ title, author, necessity, location }: Signal) => {
  return (
    <div className='w-full m-4 border-4'>
      <p>{title}</p>
      <p>{author}</p>
      <p>{necessity}</p>
      <p>{location}</p>
    </div>
  )
}
export default SignalCard
