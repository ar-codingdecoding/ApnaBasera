import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { BedDouble, Bath } from "lucide-react";

const ListingsPage = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

 
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        
        const params = new URLSearchParams(searchParams);
        const response = await fetch(
          `${
            import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/houses?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch listings from the server.");
        }

        const data = await response.json();
        setListings(data.houses);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  
  const renderActiveFilters = () => {
    const filters = [];
    if (searchParams.get("type"))
      filters.push(
        <span key="type" className="font-semibold mx-1">
          {searchParams.get("type")}
        </span>
      );
    if (searchParams.get("beds"))
      filters.push(
        <span key="beds" className="font-semibold mx-1">
          {searchParams.get("beds")}+ Beds
        </span>
      );
    if (searchParams.get("baths"))
      filters.push(
        <span key="baths" className="font-semibold mx-1">
          {searchParams.get("baths")}+ Baths
        </span>
      );
    if (searchParams.get("search"))
      filters.push(
        <span key="search" className="font-semibold mx-1">
          "{searchParams.get("search")}"
        </span>
      );

    if (filters.length === 0) {
      return <p>Showing all available properties.</p>;
    }
    return <p>Showing results for: {filters}</p>;
  };

  return (
    <main className="container mx-auto p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
        Available Listings
      </h2>

      <div className="text-center text-gray-600 mb-8">
        {renderActiveFilters()}
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <p className="text-xl text-indigo-600">Loading listings...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10 bg-red-100 text-red-700 p-4 rounded-lg">
          <p className="text-xl">Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {listings.length > 0 ? (
              listings.map((item) => (
                
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row overflow-hidden"
                >
                  {/* Text Content */}
                  <div className="p-5 flex flex-col w-full md:w-2/3 order-2 md:order-1">
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full mb-3 w-max">
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.location}
                    </p>
                    <p className="text-2xl text-green-600 font-semibold my-1">
                      ₹{item.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-500">
                        /month
                      </span>
                    </p>
                    <p className="mt-2 text-gray-600 text-sm flex-grow">
                      {item.description.substring(0, 120)}
                      {item.description.length > 120 && "..."}
                    </p>

                    <div className="flex items-center text-gray-500 text-sm mt-4 border-t pt-4">
                      <span className="flex items-center mr-4">
                        <BedDouble size={16} className="mr-2 text-indigo-500" />{" "}
                        {item.beds} Beds
                      </span>
                      <span className="flex items-center">
                        <Bath size={16} className="mr-2 text-indigo-500" />{" "}
                        {item.baths} Baths
                      </span>
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="w-full md:w-1/3 h-48 md:h-auto order-1 md:order-2">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/400x400/CCCCCC/FFFFFF?text=No+Image";
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 lg:col-span-2">
                <p className="text-xl text-gray-500">
                  No listings match your criteria.
                </p>
                <Link
                  to="/"
                  className="text-indigo-600 hover:underline mt-2 inline-block"
                >
                  Go back to Home
                </Link>
              </div>
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10 flex justify-center">
             
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default ListingsPage;
