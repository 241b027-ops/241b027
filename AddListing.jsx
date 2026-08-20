import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingForm from "../components/ListingForm";
import { propertyApi } from "../services/api";

const AddListing = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const { property } = await propertyApi.create(formData);
      navigate(`/properties/${property._id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-display font-medium mb-1">Create a new listing</h1>
      <p className="text-sm text-ink/60 mb-8">Tell guests about your place.</p>
      <ListingForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Publish listing" />
    </div>
  );
};

export default AddListing;
