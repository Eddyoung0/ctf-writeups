import React from 'react'
import ErrorImg from '../img/error404.png';

const error404page = () => {
  return (
   <>
   <div className='w-auto h-screen rounded-lg p-4 flex flex-col items-center justify-center'>
    <img src={ErrorImg} alt="Error 404" width={500} className='mb-10 w-80 sm:w-100 md:w-115 lg:w-130' />
    <div className='w-full max-w-2xl text-center px-4 relative bottom-15'>
    <h2 className='text-md sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-3 tracking-wide'>Oops, we nearly lost you</h2>
    <h2 className='text-sm md:text-lg lg:text-xl font-light'>let's get you back to where you are suppossed to be</h2>
    <div className='flex justify-center'>
      <button 
        onClick={() => window.location.href = '/'}
        className='mt-6 sm:mt-8 bg-[#007E5D] text-white px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-[#005A40] transition duration-300'>
        Go to Home Page
      </button>
    </div>
    </div>
   </div>
   </>
  )
}

export default error404page;