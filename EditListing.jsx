import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListingForm from "../components/ListingForm";
import { propertyApi } from "../services/api";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyApi.getById(id);
        setProperty(data.property);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await propertyApi.update(id, formData);
      navigate(`/properties/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveExisting = async (publicId) => {
    try {
      const { property: updated } = await propertyApi.removeImage(id, publicId);
      setProperty(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-ink/50">Loading…</div>;
  }

  if (error || !property) {
    return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-red-700">{error}</div>;
  }

  const initialValues = {
    title: property.title,
    description: property.description,
    propertyType: property.propertyType,
    address: property.location.address,
    city: property.location.city,
    state: property.location.state,
    country: property.location.country,
    zipCode: property.location.zipCode,
    pricePerNight: property.pricePerNight,
    cleaningFee: property.cleaningFee,
    maxGuests: property.maxGuests,
    bedrooms: property.bedrooms,
    beds: property.beds,
    bathrooms: property.bathrooms,
    amenities: property.amenities,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-display font-medium mb-1">Edit listing</h1>
      <p className="text-sm text-ink/60 mb-8">Update your listing details.</p>
      <ListingForm
        initialValues={initialValues}
        existingImages={property.images}
        onRemoveExisting={handleRemoveExisting}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </div>
  );
};

export default EditListing;
