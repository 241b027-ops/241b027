import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookingApi } from "../services/api";

const msPerNight = 1000 * 60 * 60 * 24;

const rangesOverlap = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

const BookingWidget = ({ property, bookedRanges = [] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isHost = user && property.host?._id === user._id;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / msPerNight;
    return diff > 0 ? Math.round(diff) : 0;
  }, [checkIn, checkOut]);

  const totalPrice = nights > 0 ? nights * property.pricePerNight + (property.cleaningFee || 0) : 0;

  const validateDates = () => {
    if (!checkIn || !checkOut) return "Please select check-in and check-out dates";
    if (nights <= 0) return "Check-out must be after check-in";

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const conflict = bookedRanges.some((r) => rangesOverlap(start, end, new Date(r.checkIn), new Date(r.checkOut)));
    if (conflict) return "Those dates overlap with an existing booking";

    return "";
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      navigate("/login", { state: { from: { pathname: `/properties/${property._id}` } } });
      return;
    }

    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (Number(guests) > property.maxGuests) {
      setError(`This listing sleeps a maximum of ${property.maxGuests} guests`);
      return;
    }

    setSubmitting(true);
    try {
      await bookingApi.create({ propertyId: property._id, checkIn, checkOut, guests });
      setSuccess("Booking confirmed! Check My trips for details.");
      setCheckIn("");
      setCheckOut("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-5 sticky top-20">
      <p className="text-lg">
        <span className="font-semibold">${property.pricePerNight}</span>{" "}
        <span className="text-ink/60 text-sm">/ night</span>
      </p>

      <form onSubmit={handleBook} className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label-field" htmlFor="bw-checkin">
              Check-in
            </label>
            <input
              id="bw-checkin"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-field" htmlFor="bw-checkout">
              Check-out
            </label>
            <input
              id="bw-checkout"
              type="date"
              min={checkIn || new Date().toISOString().split("T")[0]}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <div>
          <label className="label-field" htmlFor="bw-guests">
            Guests
          </label>
          <input
            id="bw-guests"
            type="number"
            min="1"
            max={property.maxGuests}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="input-field"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}
        {success && <p className="text-sm text-moss">{success}</p>}

        {isHost ? (
          <p className="text-sm text-ink/50 text-center pt-1">This is your own listing.</p>
        ) : (
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Booking…" : user ? "Reserve" : "Log in to book"}
          </button>
        )}

        {nights > 0 && (
          <div className="pt-3 border-t border-stone-line text-sm space-y-1.5">
            <div className="flex justify-between text-ink/70">
              <span>
                ${property.pricePerNight} × {nights} night{nights > 1 ? "s" : ""}
              </span>
              <span>${property.pricePerNight * nights}</span>
            </div>
            {property.cleaningFee > 0 && (
              <div className="flex justify-between text-ink/70">
                <span>Cleaning fee</span>
                <span>${property.cleaningFee}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-1.5 border-t border-stone-line">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingWidget;
