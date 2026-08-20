import { useState } from "react";

const SearchBar = ({ initialValues = {}, onSearch }) => {
  const [city, setCity] = useState(initialValues.city || "");
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || "");
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || "");
  const [guests, setGuests] = useState(initialValues.guests || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, checkIn, checkOut, guests });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col md:flex-row md:items-end gap-4 md:gap-2 p-4 md:p-2 md:pl-5"
    >
      <div className="flex-1 md:border-r border-stone-line md:pr-4">
        <label className="label-field" htmlFor="city">
          Destination
        </label>
        <input
          id="city"
          type="text"
          placeholder="Search by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full bg-transparent text-sm placeholder:text-ink/40 focus:outline-none py-1.5"
        />
      </div>
      <div className="flex-1 md:border-r border-stone-line md:px-4">
        <label className="label-field" htmlFor="checkIn">
          Check-in
        </label>
        <input
          id="checkIn"
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none py-1.5"
        />
      </div>
      <div className="flex-1 md:border-r border-stone-line md:px-4">
        <label className="label-field" htmlFor="checkOut">
          Check-out
        </label>
        <input
          id="checkOut"
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none py-1.5"
        />
      </div>
      <div className="flex-1 md:px-4">
        <label className="label-field" htmlFor="guests">
          Guests
        </label>
        <input
          id="guests"
          type="number"
          min="1"
          placeholder="Add guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full bg-transparent text-sm placeholder:text-ink/40 focus:outline-none py-1.5"
        />
      </div>
      <button type="submit" className="btn-gold shrink-0 w-full md:w-auto">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
