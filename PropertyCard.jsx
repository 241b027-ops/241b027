import { Link } from "react-router-dom";

const fallbackImg = "https://placehold.co/600x400/2F4B3C/FBF8F3?text=Wayfare";

const PropertyCard = ({ property }) => {
  const image = property.images?.[0]?.url || fallbackImg;

  return (
    <Link to={`/properties/${property._id}`} className="group block">
      <div className="relative overflow-hidden rounded-card aspect-[4/3] bg-moss-50">
        <img
          src={image}
          alt={property.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-paper/90 text-ink text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
          {property.propertyType}
        </span>
      </div>
      <div className="mt-3 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-ink leading-snug line-clamp-1">{property.title}</h3>
          {property.ratingsCount > 0 && (
            <span className="flex items-center gap-1 text-sm text-ink/70 shrink-0">
              ★ {property.ratingsAverage.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-sm text-ink/60">
          {property.location?.city}, {property.location?.country}
        </p>
        <p className="text-sm pt-1">
          <span className="font-semibold">${property.pricePerNight}</span>{" "}
          <span className="text-ink/60">/ night</span>
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;
