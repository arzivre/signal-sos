import { Signal as SignalFormInput } from '@prisma/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import Loader from 'src/components/Loader'
import { useSession } from 'next-auth/react'

const FormCreateSignal = () => {
  const { data: session, status } = useSession()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignalFormInput>({
    defaultValues: {
      status: true,
      type: 'sos',
    },
  })

  const onSubmit: SubmitHandler<SignalFormInput> = async (data) => {
    // Add userId
    data.userId = session?.user?.id!
    // Post
    const response = await fetch(`/api/user/${session?.user?.id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full my-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'
    >
      <div>
        <p>Chose S.O.S if you need help</p>
        <p>
          Chose Shelter if you want to inform people that you are provide a help
          place, medical, food or clothes , etc.
        </p>
      </div>
      <fieldset>
        <legend>Select type signal</legend>
        <div className='flex justify-start gap-8'>
          <label className=''>
            <input
              type='radio'
              {...register('type')}
              value='sos'
              className='m-4 ml-0 appearance-none checked:bg-blue-500'
            />
            S.O.S
          </label>

          <label>
            <input
              type='radio'
              {...register('type')}
              value='shelter'
              className='m-4 appearance-none peer rounded-md checked:bg-blue-500'
            />
            Shelter
          </label>
        </div>
      </fieldset>

      <div className=''>
        <p>fill your name</p>
      </div>
      <label className='block'>
        <span className='block mb-2 text-sm font-medium text-slate-700'>
          Name
        </span>
        <input
          type='text'
          {...register('author')}
          className='w-full peer rounded-md'
        />
        <p className='mt-2 invisible peer-invalid:visible text-pink-600 text-sm'>
          Please provide a name
        </p>
      </label>

      <div>
        <p>tell your problem in the title</p>
        <p>example</p>
        <ol>
          <li>1. Running out water</li>
          <li>2. we need people to get people out from building</li>
        </ol>
      </div>
      <label className='block'>
        <span className='block mb-2 text-sm font-medium text-slate-700'>
          Title
        </span>
        <input
          type='text'
          {...register('title')}
          className='w-full peer rounded-md'
        />
      </label>

      <div>
        <p>describe location where people need to gather or meet</p>
      </div>
      <label className='block'>
        <span className='block mb-2 text-sm font-medium text-slate-700'>
          Location
        </span>
        <input
          type='text'
          {...register('location')}
          className='w-full peer rounded-md'
        />
      </label>

      <div>
        <ul>
          <li>
            a. for type S.O.S describe what you need, example: we need water and
            clothes
          </li>
          <li>
            b. for type Shelter describe what you provide, example: we have
            place for 8 people , food and water for a week
          </li>
        </ul>
      </div>
      <label className='block'>
        <span className='block mb-2 text-sm font-medium text-slate-700'>
          Necessity
        </span>
        <input
          type='text'
          {...register('necessity')}
          className='w-full peer rounded-md'
        />
      </label>

      {isSubmitting ? (
        <button disabled className='px-8 py-4 bg-green-500'>
          <Loader /> Loading
        </button>
      ) : (
        <button
          type='submit'
          className='grid-col-[3_/_4] px-8 py-4 bg-green-500'
        >
          Submit
        </button>
      )}
    </form>
  )
}

export default FormCreateSignal
