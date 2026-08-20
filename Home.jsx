import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import PropertyCard from "../components/PropertyCard";
import { propertyApi } from "../services/api";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const filters = {
    city: searchParams.get("city") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    amenities: searchParams.get("amenities") ? searchParams.get("amenities").split(",") : [],
  };

  const updateFilters = useCallback(
    (next) => {
      const params = {};
      Object.entries(next).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return;
        params[key] = Array.isArray(value) ? value.join(",") : value;
      });
      setSearchParams(params);
    },
    [setSearchParams]
  );

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError("");
      try {
        const query = Object.fromEntries(searchParams.entries());
        const data = await propertyApi.list(query);
        setProperties(data.properties);
        setTotal(data.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [searchParams]);

  return (
    <div>
      <section className="border-b border-stone-line bg-moss-50/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10">
          <p className="text-xs uppercase tracking-widest text-moss font-semibold mb-3">Find your next stay</p>
          <h1 className="text-3xl sm:text-4xl font-display font-medium max-w-xl mb-8">
            Places with character, hosted by people who love them.
          </h1>
          <SearchBar initialValues={filters} onSearch={(vals) => updateFilters({ ...filters, ...vals })} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          <FilterPanel filters={filters} onChange={updateFilters} />

          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm text-ink/60">
                {loading ? "Searching…" : `${total} stay${total === 1 ? "" : "s"} found`}
              </h2>
            </div>

            {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

            {!loading && properties.length === 0 && !error && (
              <div className="card p-10 text-center">
                <p className="font-display text-lg mb-1">No stays match those filters</p>
                <p className="text-sm text-ink/60">Try adjusting your dates, price range, or amenities.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/3] rounded-card bg-moss-50" />
                      <div className="h-3 w-3/4 bg-moss-50 rounded mt-3" />
                      <div className="h-3 w-1/2 bg-moss-50 rounded mt-2" />
                    </div>
                  ))
                : properties.map((property) => <PropertyCard key={property._id} property={property} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
