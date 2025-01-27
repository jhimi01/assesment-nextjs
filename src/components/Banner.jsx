import React from 'react'
import BookingForm from './BookingForm'

export default function Banner() {
  return (
    <div>
        <div
        className="text-white relative  flex items-center pt-6"
        style={{
          backgroundImage: `linear-gradient(
            to right, 
            rgba(0, 0, 0, 0.7), 
            rgba(0, 0, 0, 0.3) 40%, 
            rgba(0, 0, 0, 0.1) 50%
          ),
          linear-gradient(
              to bottom, 
              rgba(0, 0, 0, 0.8), 
              rgba(0, 0, 0, 0.4) 20%, 
              rgba(0, 0, 0, 0.1) 25%
            ),
          url("https://www.qatarairways.com/content/dam/images/renditions/horizontal-1/campaigns/global/grsp-2025/dream-destinations/hn-dream-destination-city.jpg")`,

          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "78vh",
          width: "100%",
        }}
      >
        {/* <div
        className="absolute inset-0 bg-black opacity-50"
      ></div> */}
        <div className="wrapper space-y-8">
          <h2 className="text-5xl">Dream destinations meet perfect offers</h2>
          <p className="text-lg">Save up to 20%*</p>
          <button className="border border-white hover:bg-white hover:text-black font-semibold rounded-full px-5 py-3">
            Book now
          </button>
        </div>
      </div>

      <div className="mb-20">
        <BookingForm />
      </div>
    </div>
  )
}
