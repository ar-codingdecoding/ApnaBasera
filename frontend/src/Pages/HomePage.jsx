import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpecialFeatures from "../components/SpecialFeatures.jsx";
import { useEffect } from "react";

const HomePage = () => {
  const [featuredHouses, setFeaturedHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000/api"
          }/houses?limit=10`
        );
        const data = await response.json();
        if (data.success) {
          setFeaturedHouses(data.houses);
        }
      } catch (error) {
        console.error("Failed to fetch houses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHouses();
  }, []);

  // --- Scrolling Section ---
  const scrollContainerRef = useRef(null);
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // --- Search Functionality ---
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [minBaths, setMinBaths] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (propertyType) params.append("type", propertyType);
    if (minBeds) params.append("beds", minBeds);
    if (minBaths) params.append("baths", minBaths);
    navigate(`/listings?${params.toString()}`);
  };

  // --- Razorpay Payment ---
  const handlePayment = async (amount, title, houseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to make a booking.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      // 1. Create Order on Backend
      const orderResponse = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000/api"
        }/payment/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: amount, currency: "INR" }),
        }
      );
      const data = await orderResponse.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create order.");
      }

      const { order, key_id } = data;
      console.log(order);

      // 2. Open Razorpay Checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "ApnaBasera",
        description: `Booking for ${title}`,
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          const verifyResponse = await fetch(
            `${
              import.meta.env.VITE_API_URL || "http://localhost:5000/api"
            }/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                houseId: houseId, 
              }),
            }
          );

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            alert(`Payment successful! Payment ID: ${verifyData.payment_id}`);
          } else {
            alert(`Payment verification failed. Please contact support.`);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#4F46E5",
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section
        className="relative h-[100vh] sm:h-[90vh] md:h-[85vh] lg:h-[80vh] bg-cover bg-center text-white"
        style={{
          backgroundImage: "url('/apartment1.jpg')",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center p-3 sm:p-4 md:p-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Home Is The Starting Place Of <br className="hidden sm:block" />{" "}
            Love, Hope And Dreams
          </h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
            <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 font-semibold text-sm sm:text-base transition-colors">
              For Rent
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-gray-700 hover:bg-gray-600 font-semibold text-sm sm:text-base transition-colors">
              For Sale
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl bg-white bg-opacity-95 rounded-lg shadow-xl p-3 sm:p-4 md:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
              <div className="sm:col-span-2 lg:col-span-1">
                <label
                  htmlFor="property-type"
                  className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-left"
                >
                  Property Type
                </label>
                <select
                  id="property-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300 text-sm sm:text-base"
                >
                  <option value="">Any Type</option>
                  <option value="PG">PG</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="min-beds"
                  className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-left"
                >
                  Min. Beds
                </label>
                <select
                  id="min-beds"
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300 text-sm sm:text-base"
                >
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3+</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="bathroom"
                  className="block text-gray-700 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 text-left"
                >
                  Bathroom
                </label>
                <select
                  id="bathroom"
                  value={minBaths}
                  onChange={(e) => setMinBaths(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 border border-gray-300 text-sm sm:text-base"
                >
                  <option value="">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3+</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-md font-semibold transition shadow-md flex items-center justify-center text-sm sm:text-base"
                >
                  <Search size={16} className="mr-2 sm:hidden" />
                  <Search size={20} className="mr-2 hidden sm:block" />
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Recommended Apartment Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-indigo-600 font-semibold">
                Featured Properties
              </p>
              <h3 className="text-3xl font-bold text-gray-800">
                Recommended For You
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full border hover:bg-gray-200 transition"
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full border hover:bg-gray-200 transition"
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide"
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              featuredHouses.map((house) => (
                <div
                  key={house._id}
                  className="min-w-[300px] bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  <img
                    src={house.img}
                    alt={house.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/300x192/CCCCCC/FFFFFF?text=Image";
                    }}
                  />
                  <div className="p-4 flex flex-col flex-grow bg-gray-800 text-white">
                    <h4 className="text-lg font-semibold">{house.title}</h4>
                    <p className="font-bold mb-2">
                      ₹{house.price.toLocaleString()}/month
                    </p>
                    <div className="flex items-center text-xs opacity-80 mb-4">
                      <span>{house.beds} Bed</span>
                      <span className="mx-2">|</span>
                      <span>{house.baths} Bath</span>
                      <span className="mx-2">|</span>
                      <span>{house.type}</span>
                    </div>
                    <button
                      onClick={() =>
                        handlePayment(house.price, house.title, house._id)
                      }
                      className="mt-auto w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. What Makes ApnaBasera Special? Section */}
      <SpecialFeatures />

      {/* 4. CTA Section */}
      <section className="bg-custom-navy text-white text-center py-8 sm:py-12 md:py-3">
        <div className="container mx-auto px-4 sm:px-6">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Join 10,000+ Students Using ApnaBasera
          </h3>
          <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90">
            Your reliable platform for accommodations and services.
          </p>
          <Link
            to="/login"
            className="inline-block bg-white text-indigo-600 px-6 sm:px-8 py-2 sm:py-3 rounded-md font-semibold hover:bg-gray-200 transition text-sm sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
