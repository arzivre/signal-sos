import { People, SignalType } from 'lib/types'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface PeopleForm extends People {
  signalId: string
}

const FormPeopleJoinSignal: React.FC<{
  id: string
  type: SignalType
  isJoined: People | undefined
}> = ({ id, type, isJoined }) => {
  const [showForm, setShowForm] = useState(false)

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PeopleForm>()
  //? how useForm initialize dynamic data?

  const onSubmit: SubmitHandler<PeopleForm> = async (data) => {
    data.signalId = id
    data.type = type
    const response = await fetch(`/api/people/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
    reset()
    setShowForm(!showForm)
  }

  if (isJoined) return <p>You already join</p>

  if (!showForm)
    return (
      <button
        onClick={() => setShowForm(!showForm)}
        className='my-2 px-4 py-2 bg-green-400 rounded-sm'
      >
        {type === 'sos' ? 'send help' : 'join shelter'}
      </button>
    )

  return (
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
      <div className='flex justify-between'>
        <button
          onClick={() => setShowForm(!showForm)}
          className='my-2 px-4 py-2 bg-green-400'
        >
          Back
        </button>
        <button type='submit' className='my-2 px-4 py-2 bg-blue-400'>
          Submit
        </button>
      </div>
    </form>
  )
}

export default FormPeopleJoinSignal
