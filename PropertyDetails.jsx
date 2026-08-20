import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { propertyApi } from "../services/api";
import BookingWidget from "../components/BookingWidget";

const fallbackImg = "https://placehold.co/1200x800/2F4B3C/FBF8F3?text=Wayfare";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await propertyApi.getById(id);
        setProperty(data.property);
        setBookedRanges(data.bookedRanges || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-ink/50">Loading…</div>;
  }

  if (error || !property) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-red-700 mb-3">{error || "Listing not found"}</p>
        <Link to="/" className="text-moss underline">
          Back to search
        </Link>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [{ url: fallbackImg }];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-display font-medium">{property.title}</h1>
      <p className="text-sm text-ink/60 mt-1">
        {property.location?.address}, {property.location?.city}, {property.location?.country}
      </p>

      <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-5 rounded-card overflow-hidden aspect-[16/9]">
        <div className="col-span-4 sm:col-span-2 row-span-2">
          <img src={images[0].url} alt={property.title} className="h-full w-full object-cover" />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="hidden sm:block">
            <img src={img.url} alt={`${property.title} ${i + 2}`} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10 mt-8">
        <div>
          <div className="pb-6 border-b border-stone-line">
            <h2 className="font-display text-xl mb-1">
              Hosted by {property.host?.name || "a Wayfare host"}
            </h2>
            <p className="text-sm text-ink/60">
              {property.maxGuests} guests · {property.bedrooms} bedroom{property.bedrooms === 1 ? "" : "s"} ·{" "}
              {property.beds} bed{property.beds === 1 ? "" : "s"} · {property.bathrooms} bath
              {property.bathrooms === 1 ? "" : "s"}
            </p>
          </div>

          <div className="py-6 border-b border-stone-line">
            <h3 className="font-semibold mb-2">About this place</h3>
            <p className="text-sm text-ink/80 whitespace-pre-line leading-relaxed">{property.description}</p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="py-6">
              <h3 className="font-semibold mb-3">What this place offers</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-ink/80">
                {property.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <BookingWidget property={property} bookedRanges={bookedRanges} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
