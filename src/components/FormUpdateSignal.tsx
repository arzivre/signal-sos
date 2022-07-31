import { Signal, Signal as SignalFormInput } from '@prisma/client'
import { useSession } from 'next-auth/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Loader from 'src/components/Loader'
import { mutate } from 'swr'

interface FormUpdateSignalProps {
  data?: Signal
  setUpdate: Dispatch<SetStateAction<boolean>>
}
interface GeoLocation {
  status: string
  lat?: number
  long?: number
}

const FormUpdateSignal: React.FC<FormUpdateSignalProps> = ({
  data,
  setUpdate,
}) => {
  const { data: session } = useSession()

  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    status: 'loading',
    long: 51.505,
    lat: -0.09,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignalFormInput>({
    defaultValues: {
      status: true,
      id: data?.id,
      type: data?.type,
      author: data?.author,
      title: data?.title,
      location: data?.location,
      lat: data?.lat,
      long: data?.long,
      necessity: data?.necessity,
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

  const onSubmit: SubmitHandler<SignalFormInput> = async (formData) => {
    // Add userId
    formData.userId = session?.user?.id!
    // PUT
    await fetch(`/api/user/${data?.id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(formData),
    })
    mutate(`/api/user/${data?.id}`)
    setUpdate(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='my-10 grid w-full grid-cols-1 gap-x-8 gap-y-4 text-xl md:grid-cols-2'
    >
      <p>Id: {data?.id}</p>
      <button
        onClick={() => setUpdate(false)}
        className='rounded border-2 border-black bg-red-50 px-4 py-2
        text-2xl font-semibold text-red-500 hover:bg-red-600 hover:text-red-50'
      >
        Cancel Update
      </button>
      <div className='border-b-2 pb-2 text-lg'>
        <p>Chose S.O.S if you need help</p>
        <p>
          Chose Shelter if you want to inform people that you are provide a help
          such a place, medical, food or clothes , etc.
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
              className='peer m-4 appearance-none rounded-md checked:bg-blue-500'
            />
            Shelter
          </label>
        </div>
      </fieldset>

      <div className='border-b-2 pb-2 text-lg'>
        <p>Fill in a name that you are comfortable with for people to call</p>
      </div>
      <label className='block'>
        <span className='mb-2 block text-slate-900'>Name</span>
        <input
          type='text'
          {...register('author')}
          className='peer w-full rounded-md text-hitam'
        />
        <p className='invisible mt-2 text-pink-600 peer-invalid:visible'>
          Please provide a name
        </p>
      </label>

      <div className='border-b-2 pb-2 text-lg'>
        <p>tell your problem in the title</p>
        <p>example</p>
        <ol>
          <li>1. Running out water</li>
          <li>2. we need people to get people out from building</li>
        </ol>
      </div>
      <label className='block'>
        <span className='mb-2 block text-slate-900'>Title</span>
        <input
          type='text'
          {...register('title')}
          className='peer w-full rounded-md text-hitam'
        />
      </label>

      <div className='border-b-2 pb-2 text-lg'>
        <p>Location where people need to gather or meet.</p>
        <br />
        <p>
          (optional) Latidude, Longitude to generate Map. Use Show my location
          buttton to show ur current location or u cant write manualy latitude,
          longitude. Usefull link:{' '}
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
        <span className='mb-2 block text-slate-900'>Location</span>
        <input
          type='text'
          {...register('location')}
          className='peer mb-2 w-full rounded-md text-hitam'
        />

        <div className='flex justify-between gap-x-4'>
          <span className='block text-slate-900'>
            Latitude
            <input
              type='text'
              {...register('lat')}
              className='peer mt-2 w-full rounded-md text-hitam'
            />
          </span>
          <span className='block text-slate-900'>
            Longitude
            <input
              type='text'
              {...register('long')}
              className='peer mt-2 w-full rounded-md text-hitam'
            />
          </span>
        </div>
        <div className='flex justify-between'>
          <button
            onClick={() => geoFindMe()}
            className='my-3  rounded bg-blue-900 px-4 py-2 font-bold text-blue-50'
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

      <div className='border-b-2 pb-2 text-lg'>
        <p>
          What you provide or what you need, example: we have place for 8
          people, food and water for a week. we need clothes and medical suply
        </p>
      </div>
      <label className='block'>
        <span className='mb-2 block text-slate-900'>Necessity</span>
        <input
          type='text'
          {...register('necessity')}
          className='peer w-full rounded-md text-hitam'
        />
      </label>

      <div />
      {isSubmitting ? (
        <button disabled className='bg-green-500 px-8 py-4'>
          <Loader /> Loading
        </button>
      ) : (
        <button
          type='submit'
          className='grid-col-[3_/_4] bg-green-500 px-8 py-4'
        >
          Update
        </button>
      )}
    </form>
  )
}
export default FormUpdateSignal
