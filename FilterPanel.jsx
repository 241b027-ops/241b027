const PROPERTY_TYPES = ["Apartment", "House", "Villa", "Cabin", "Loft", "Cottage", "Studio", "Other"];
const AMENITIES = [
  "Wifi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air conditioning",
  "Heating",
  "Free parking",
  "Pool",
  "TV",
  "Workspace",
];

const FilterPanel = ({ filters, onChange }) => {
  const toggleAmenity = (amenity) => {
    const current = filters.amenities || [];
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities: next });
  };

  return (
    <div className="card p-5 space-y-6 sticky top-20">
      <div>
        <h3 className="text-sm font-semibold mb-3">Property type</h3>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...filters, propertyType: filters.propertyType === type ? "" : type })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filters.propertyType === type
                  ? "bg-moss text-paper border-moss"
                  : "border-stone-line text-ink/70 hover:border-ink/40"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Price per night</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="input-field"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Amenities</h3>
        <div className="space-y-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={(filters.amenities || []).includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="rounded border-stone-line text-moss focus:ring-moss"
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange({ city: filters.city, checkIn: filters.checkIn, checkOut: filters.checkOut })}
        className="text-sm text-moss underline underline-offset-2"
      >
        Clear filters
      </button>
    </div>
  );
};

export default FilterPanel;
