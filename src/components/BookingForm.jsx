import {
  ArrowLeftRight,
  Calendar,
  LocateFixed,
  LocateIcon,
  Plane,
  Plus,
} from "lucide-react";

const BookingForm = () => {
  return (
    <div className="bg-white space-y-5 -mt-20 z-50 shadow-xl relative w-9/12 mx-auto rounded-lg py-4 px-7">
      <div className="bg-gray-100 py-3 text-slate-800 px-6">
        <ul className="flex items-center justify-between">
          <li>
            <button className="text-primary flex items-center">
              <Plane /> Book a flight
            </button>
          </li>
          <li>
            <button className="text-primary flex items-center">
              <LocateFixed /> Qatar stopover
            </button>
          </li>
          <li>
            <button className="text-primary flex items-center">
              <Calendar /> Manege / Check in
            </button>
          </li>
          <li>
            <button className="text-primary flex items-center">
              <LocateIcon /> Flight status
            </button>
          </li>
        </ul>
      </div>

      <div className="flex items-center text-slate-800  gap-4 my-4">
        <label className="flex items-center text-xl gap-2">
          <input
            type="radio"
            value="female"
            className="border-slate-400 focus:ring focus:ring-slate-300"
          />
          Return
        </label>
        <label className="flex items-center text-xl gap-2">
          <input
            type="radio"
            value="female"
            className="border-slate-400 focus:ring focus:ring-slate-300"
          />
          One way
        </label>
        <label className="flex items-center text-xl gap-2">
          <input
            type="radio"
            value="female"
            className="border-slate-400 focus:ring focus:ring-slate-300"
          />
          Multi-city
        </label>
      </div>

      <div className="border w-full text-slate-800 flex items-center justify-between border-slate-400 px-5 py-3 rounded-lg">
        <h2>From</h2>
        <ArrowLeftRight />
        <h2>To</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <input type="checkbox" />
          <h3 className="text-lg">Book using Avios</h3>
        </div>
      <div className="flex gap-5">
      <div className="flex items-center">
          <Plus /> Add promo code
        </div>
        <button className="bg-primary px-5 text-white py-4 rounded-full"> Search Flights</button>
      </div>
      </div>
    </div>
  );
};

export default BookingForm;
