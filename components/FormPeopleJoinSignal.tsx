import { People } from 'lib/types'
import { SubmitHandler, useForm } from 'react-hook-form'

interface PeopleForm extends People {
  signalId: string
}

const FormPeopleJoinSignal: React.FC<{
  id: string
  status: boolean
  type: 'shelter' | 'sos'
}> = ({ id, type }) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PeopleForm>({
    defaultValues: {
      type,
      signalId: id,
    },
  })
  const onSubmit: SubmitHandler<PeopleForm> = async (data) => {
    const response = await fetch(`/api/signal/join-signal`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className='block'>
          <span className='block mb-2 text-sm font-medium text-slate-700'>
            Name
          </span>
          <input
            type='text'
            {...register('name')}
            className='w-full peer rounded-md'
          />
        </label>
        <label className='block'>
          <span className='block mb-2 text-sm font-medium text-slate-700'>
            What help you provide
          </span>
          <input
            type='text'
            {...register('items')}
            className='w-full peer rounded-md'
          />
        </label>
        <button className='p-8 bg-green-400'>
          {type === 'sos' ? 'send help' : 'join shelter'}
        </button>
        <button type='submit' className='p-8 bg-blue-400'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default FormPeopleJoinSignal
