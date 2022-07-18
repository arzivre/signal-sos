import { Signal } from 'lib/types'
import { useForm } from 'react-hook-form'

interface PeopleForm extends Signal {
  signalId: string
}

const FormPeopleJoinSignal: React.FC<{
  id: string
  status: boolean
  type: 'shelter' | 'sos'
}> = ({ id, status, type }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PeopleForm>({
    defaultValues: {
      status,
      type,
      signalId: id,
    },
  })
  return (
    <div>
      <form>
        <label className='block'>
          <span className='block mb-2 text-sm font-medium text-slate-700'>
            Name
          </span>
          <input
            type='text'
            // {...register('name')}
            className='w-full peer rounded-md'
          />
        </label>
        <label className='block'>
          <span className='block mb-2 text-sm font-medium text-slate-700'>
            What help you provide
          </span>
          <input
            type='text'
            // {...register('name')}
            className='w-full peer rounded-md'
          />
        </label>
        <button className='p-8 bg-green-400'>
          {type === 'sos' ? 'send help' : 'join shelter'}
        </button>
        <button className='p-8 bg-blue-400'>Submit</button>
      </form>
    </div>
  )
}

export default FormPeopleJoinSignal
