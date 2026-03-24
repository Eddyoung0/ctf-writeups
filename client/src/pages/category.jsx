import React from 'react'

const category = () => {
  return (
    <>
    <div className="w-full flex flex-wrap flex-col justify-center rounded-lg px-30 gap-y-10">
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Our Top Categories</h2>
    <div className="w-full h-0.5 bg-gray-200"></div>
  </div>
  {/* creating a default category*/}
  <div className="w-full justify-left p-5 flex flex-row flex-wrap gap-5 relative bottom-5">
  {/* first card */}
    <div className="card w-60 shadow-md cursor-pointer hover:scale-[1.02]">
  <figure>
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes"
     className=''/>
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Card Title</h2>
    <p>9 items</p>
  </div>
</div>
  </div>
  </div>
    </>
  )
}

export default category