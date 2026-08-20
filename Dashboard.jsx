import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyApi, bookingApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const fallbackImg = "https://placehold.co/200x150/2F4B3C/FBF8F3?text=Wayfare";

const Dashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [listingsData, bookingsData] = await Promise.all([
        propertyApi.mine(),
        bookingApi.host(),
      ]);
      setListings(listingsData.properties);
      setBookings(bookingsData.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    setActionError("");
    try {
      await propertyApi.remove(id);
      setListings((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setActionError(err.message);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-ink/50">Loading…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-display font-medium">Host dashboard</h1>
        <Link to="/dashboard/new" className="btn-primary">
          + New listing
        </Link>
      </div>
      <p className="text-sm text-ink/60 mb-6">Welcome back, {user?.name.split(" ")[0]}.</p>

      <div className="flex gap-1 border-b border-stone-line mb-6">
        {[
          { key: "listings", label: `Listings (${listings.length})` },
          { key: "bookings", label: `Bookings (${bookings.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-moss text-moss" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {(error || actionError) && <p className="text-sm text-red-700 mb-4">{error || actionError}</p>}

      {tab === "listings" && (
        <div className="space-y-3">
          {listings.length === 0 && (
            <div className="card p-10 text-center">
              <p className="font-display text-lg mb-1">No listings yet</p>
              <p className="text-sm text-ink/60 mb-4">Create your first listing to start hosting.</p>
              <Link to="/dashboard/new" className="btn-primary">
                + New listing
              </Link>
            </div>
          )}
          {listings.map((property) => (
            <div key={property._id} className="card p-3 flex items-center gap-4">
              <img
                src={property.images?.[0]?.url || fallbackImg}
                alt={property.title}
                className="h-20 w-28 object-cover rounded-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{property.title}</p>
                <p className="text-sm text-ink/60">
                  {property.location.city}, {property.location.country} · ${property.pricePerNight}/night
                </p>
                <p className="text-xs mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      property.isActive ? "bg-moss-50 text-moss" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {property.isActive ? "Active" : "Hidden"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/properties/${property._id}`} className="btn-outline !px-3 !py-1.5 text-xs">
                  View
                </Link>
                <Link to={`/dashboard/edit/${property._id}`} className="btn-outline !px-3 !py-1.5 text-xs">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-3">
          {bookings.length === 0 && (
            <div className="card p-10 text-center">
              <p className="font-display text-lg mb-1">No bookings yet</p>
              <p className="text-sm text-ink/60">Bookings on your listings will show up here.</p>
            </div>
          )}
          {bookings.map((booking) => (
            <div key={booking._id} className="card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium truncate">{booking.property?.title}</p>
                <p className="text-sm text-ink/60">
                  {booking.guest?.name} · {new Date(booking.checkIn).toLocaleDateString()} –{" "}
                  {new Date(booking.checkOut).toLocaleDateString()} · {booking.guests} guest
                  {booking.guests > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold">${booking.totalPrice}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    booking.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-moss-50 text-moss"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
