import type { People, TypeSignal } from '@prisma/client'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { mutate } from 'swr'

type PeopleForm = People

const FormPeopleJoinSignal: React.FC<{
  id: string
  type: TypeSignal
  isJoined: People | undefined
}> = ({ id, type, isJoined }) => {
  const [showForm, setShowForm] = useState(false)
  const { status } = useSession()

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PeopleForm>()

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
    mutate(`/api/people/${id}`)
    setShowForm(!showForm)
  }

  if (isJoined) return <p>You already join</p>

  if (status === 'unauthenticated')
    return (
      <button
        onClick={() => signIn()}
        className='mt-4 text-center text-xl text-green-400 hover:underline'
      >
        Sign In Join
      </button>
    )

  if (!showForm)
    return (
      <button
        onClick={() => setShowForm(!showForm)}
        className='my-4 rounded-sm bg-green-900 px-4 py-2 text-gray-50'
      >
        {type === 'sos'
          ? 'Send help (Join Signal)'
          : 'Join shelter (Join Signal)'}
      </button>
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='text-xl text-white'>
      <h3 className='text-center text-2xl'>Form Join Signal</h3>
      <label className='block text-xl'>
        <span className='mb-2 block font-medium '>Name</span>
        <input
          type='text'
          {...register('name')}
          className='peer w-full rounded-md'
        />
      </label>
      <label className='block'>
        <span className='mb-2 block font-medium '>
          What help you provide? (optional)
        </span>
        <input
          type='text'
          {...register('items')}
          className='peer w-full rounded-md'
        />
      </label>
      <div className='flex justify-between'>
        <button
          onClick={() => setShowForm(!showForm)}
          className='my-2 bg-green-900 px-4 py-2'
        >
          Back
        </button>
        <button type='submit' className='my-2 bg-blue-900 px-4 py-2'>
          Submit
        </button>
      </div>
    </form>
  )
}

export default FormPeopleJoinSignal
