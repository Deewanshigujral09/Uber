import React from 'react'

const LocationSearchPanel = (props) => {
  console.log(props)
  //sample array for location
  const locations = [
    "24B, Near Shiv Puri Basant Nagar, Ludhiana",
    "22B Near Bawa Nursing Home, Ludhiana",
    "20A, Near Hero Cycles Modal Town Ludhiana",
    "18A Near Sighania's cafe Ludhiana"
  ]
  return (
    <div>
        {/* this is just a sampke data */}
        {
          locations.map(function(elem, idx) {
            return <div key={idx} onClick={()=> {
              props.setVehiclePanel(true)
              props.setPanelOpen(false)
            }}
            className='flex items-center rounded-xl gap-4 border-gray-50 active:border-black border-2 p-3 my-2 justify-start'>
            <h2 className='bg-[#eee] p-2 h-8 w-12 flex items-center justify-center rounded-full'><i className="ri-map-pin-fill"></i></h2>
            <h4 className='font-medium'>{elem}</h4>
          </div>
          })
        }
    </div>
  )
}

export default LocationSearchPanel