import { useState } from "react";
import ImageUploader from "./ImageUploader";

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
  "Hot tub",
  "TV",
  "Workspace",
  "Pets allowed",
  "Gym",
  "Fireplace",
  "BBQ grill",
];

const emptyForm = {
  title: "",
  description: "",
  propertyType: "Apartment",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  pricePerNight: "",
  cleaningFee: "",
  maxGuests: 1,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  amenities: [],
};

const ListingForm = ({ initialValues, existingImages = [], onRemoveExisting, onSubmit, submitting, submitLabel }) => {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (existingImages.length + files.length === 0) {
      setError("Please add at least one photo");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "amenities") {
        formData.append("amenities", JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
    files.forEach((file) => formData.append("images", file));

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <section className="space-y-4">
        <h2 className="font-display text-lg">Basics</h2>
        <div>
          <label className="label-field" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" required value={form.title} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="propertyType">
            Property type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className="input-field"
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Location</h2>
        <div>
          <label className="label-field" htmlFor="address">
            Street address
          </label>
          <input id="address" name="address" required value={form.address} onChange={handleChange} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field" htmlFor="city">
              City
            </label>
            <input id="city" name="city" required value={form.city} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="state">
              State / Region
            </label>
            <input id="state" name="state" value={form.state} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="country">
              Country
            </label>
            <input id="country" name="country" required value={form.country} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="label-field" htmlFor="zipCode">
              Zip / Postal code
            </label>
            <input id="zipCode" name="zipCode" value={form.zipCode} onChange={handleChange} className="input-field" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Details & pricing</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-field" htmlFor="pricePerNight">
              Price per night ($)
            </label>
            <input
              id="pricePerNight"
              name="pricePerNight"
              type="number"
              min="0"
              required
              value={form.pricePerNight}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="cleaningFee">
              Cleaning fee ($)
            </label>
            <input
              id="cleaningFee"
              name="cleaningFee"
              type="number"
              min="0"
              value={form.cleaningFee}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="maxGuests">
              Max guests
            </label>
            <input
              id="maxGuests"
              name="maxGuests"
              type="number"
              min="1"
              required
              value={form.maxGuests}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="bedrooms">
              Bedrooms
            </label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min="0"
              required
              value={form.bedrooms}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="beds">
              Beds
            </label>
            <input
              id="beds"
              name="beds"
              type="number"
              min="1"
              required
              value={form.beds}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="bathrooms">
              Bathrooms
            </label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min="0.5"
              step="0.5"
              required
              value={form.bathrooms}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={form.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="rounded border-stone-line text-moss focus:ring-moss"
              />
              {amenity}
            </label>
          ))}
        </div>
      </section>

      <section>
        <ImageUploader
          files={files}
          onChange={setFiles}
          existingImages={existingImages}
          onRemoveExisting={onRemoveExisting}
        />
      </section>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
};

export default ListingForm;
