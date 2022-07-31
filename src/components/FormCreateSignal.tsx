import { Signal as SignalFormInput } from '@prisma/client'
import { useForm, SubmitHandler } from 'react-hook-form'
import Loader from 'src/components/Loader'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

interface GeoLocation {
  status: string
  lat?: number
  long?: number
}
const FormCreateSignal = () => {
  const { data: session, status } = useSession()

  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    status: 'loading',
    long: 51.505,
    lat: -0.09,
  })

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

  function geoFindMe() {
    function success(position: {
      coords: { latitude: number; longitude: number }
    }) {
      setGeoLocation({
        status: 'located',
        lat: position.coords.latitude,
        long: position.coords.longitude,
      })
    }

    function error() {
      setGeoLocation({
        status: 'Error',
      })
    }

    if (!navigator.geolocation) {
      setGeoLocation({
        status: 'Geolocation is not supported by your browser',
      })
    } else {
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

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
      className='my-10 grid w-full grid-cols-1 gap-x-8 gap-y-4 rounded bg-[#16161a] p-4 text-xl text-gray-300 md:grid-cols-2 md:p-8'
    >
      <div className='border-b border-gray-600 pb-2 text-lg'>
        <p>Chose S.O.S if you need help</p>
        <p>
          Chose Shelter if you want to inform people that you are provide a help
          place, medical, food or clothes , etc.
        </p>
      </div>
      <fieldset>
        <legend className='text-gray-50'>Select type signal</legend>
        <div className='flex justify-start gap-8 text-gray-50'>
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
              className='peer m-4 appearance-none rounded-md checked:bg-blue-500'
            />
            Shelter
          </label>
        </div>
      </fieldset>

      <div className='border-b border-gray-600 pb-2 text-lg'>
        <p>Fill in a name that you are comfortable with for people to call</p>
      </div>
      <label className='block'>
        <span className='mb-2 block text-gray-50'>Name</span>
        <input
          type='text'
          {...register('author')}
          className='peer w-full rounded-md'
        />
        <p className='invisible mt-2 text-pink-600 peer-invalid:visible'>
          Please provide a name
        </p>
      </label>

      <div className='border-b border-gray-600 pb-2 text-lg'>
        <p>tell your problem in the title</p>
        <p>example</p>
        <ol>
          <li>1. Running out water</li>
          <li>2. we need people to get people out from building</li>
        </ol>
      </div>
      <label className='block'>
        <span className='mb-2 block text-gray-50'>Title</span>
        <input
          type='text'
          {...register('title')}
          className='peer w-full rounded-md'
        />
      </label>

      <div className='border-b border-gray-600 pb-2 text-lg'>
        <p>Location where people need to gather or meet.</p>
        <p>
          Latidude, Longitude to generate Map. Latidude, Longitude is not
          require but cant generate map without it
        </p>
        <p>
          Use Show my location buttton to show ur current location or u cant
          write manualy latitude, longitude
        </p>
        <p>
          usefull link:{' '}
          <a
            href='https://www.latlong.net/countries.html'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-400 hover:underline'
          >
            www.latlong.net
          </a>
        </p>
      </div>
      <label className='block'>
        <span className='mb-2 block text-gray-50'>Location</span>
        <input
          type='text'
          {...register('location')}
          className='peer mb-2 w-full rounded-md'
        />

        <div className='flex justify-between gap-x-4'>
          <span className='block text-gray-50'>
            Latitude
            <input
              type='text'
              {...register('lat')}
              className='peer mt-2 w-full rounded-md'
            />
          </span>
          <span className='block text-gray-50'>
            Longitude
            <input
              type='text'
              {...register('long')}
              className='peer mt-2 w-full rounded-md'
            />
          </span>
        </div>
        <div className='flex justify-between'>
          <button
            type='button'
            onClick={() => geoFindMe()}
            className='my-3  rounded bg-ungu px-4 py-2 font-bold text-blue-50'
          >
            Show my location
          </button>
          {geoLocation.status === 'located' && (
            <p className='my-3 px-4 py-2'>
              Latitude:{' '}
              <span className='text-amber-600'>{geoLocation.lat},</span>{' '}
              Longitude:{' '}
              <span className='text-amber-600'>{geoLocation.long}</span>
            </p>
          )}
        </div>
      </label>

      <div className='border-b border-gray-600 pb-2 text-lg'>
        <p>
          What you provide or what you need, example: we have place for 8
          people, food and water for a week. we need clothes and medical suply
        </p>
      </div>
      <label className='block'>
        <span className='mb-2 block text-gray-50'>Necessity</span>
        <input
          type='text'
          {...register('necessity')}
          className='peer w-full rounded-md'
        />
      </label>

      <div />
      {isSubmitting ? (
        <button disabled className='bg-ungu px-8 py-4'>
          <Loader /> Loading
        </button>
      ) : (
        <button
          type='submit'
          className='grid-col-[3_/_4] bg-hijau px-8 py-4'
        >
          Submit
        </button>
      )}
    </form>
  )
}

export default FormCreateSignal
