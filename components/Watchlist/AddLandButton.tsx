import React from 'react'
import { BsEmojiSunglasses } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { MdAddLocationAlt } from 'react-icons/md'
import { WatchListState } from '../../pages/watchlist'

interface Props {
  limitReached: boolean
  state: WatchListState
  addBy: 'id' | 'coordinates'
}

const AddLandButton = ({ limitReached, state, addBy }: Props) => {
  const options = {
    id: { success: 'successId', loading: 'loadingQueryId' },
    coordinates: {
      success: 'successCoordinates',
      loading: 'loadingQueryCoordinates',
    },
  }
  // Loading Icon Display Conditions
  const loadingIconBoolean =
    state === 'loadingFirst' ||
    state === options[addBy].loading ||
    state === 'loading'

  // Add Icon Display Conditions
  const addIconBoolean =
    (state === 'loaded' ||
      state.includes('bad') ||
      state.includes('limit') ||
      (state.includes('loadingQuery') && state !== options[addBy].loading)) &&
    !limitReached

  return (
    <button
      disabled={limitReached || state === 'noWallet'}
      className='items-center justify-center font-medium text-center transition-all flex grow gap-2 ease-in hover:shadow-subtleWhite z-10 p-2 rounded-xl bg-gradient-to-br from-pink-600 to-blue-500'
    >
      {/* Loading Icon */}
      {loadingIconBoolean && (
        <svg className='animate-spin-slow h-6 w-6 border-4 border-t-gray-300 border-l-gray-300 border-gray-800 rounded-full' />
      )}
      {/* Land Limit Icon */}
      {limitReached && (
        <IoWarningOutline className='h-5 w-5 relative bottom-[0.15rem]' />
      )}
      {state === options[addBy].success && (
        <BsEmojiSunglasses className='h-5 w-5 relative bottom-[0.1rem]' />
      )}
      {/* Add Land Icon */}
      {addIconBoolean && (
        <MdAddLocationAlt className='h-5 w-5 relative bottom-[0.2rem]' />
      )}
      {/* Button Text */}
      <span>
        {limitReached
          ? 'Limit Reached'
          : state === 'loading' || state === 'loadingFirst'
          ? 'Fetching Data'
          : state === options[addBy].loading
          ? 'Verifying Land'
          : state === 'noWallet'
          ? 'No Wallet Detected'
          : state === options[addBy].success
          ? 'Success!'
          : 'Add Land'}
      </span>
    </button>
  )
}

export default AddLandButton
