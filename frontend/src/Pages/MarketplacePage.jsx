import React, { useState } from 'react';


const initialItems = [
  {
    name: "Study Table",
    price: "₹1200",
    condition: "Good",
    description: "Wooden table, used for 6 months.",
    img: '/study table.jpg'
  },
  {
    name: "Laptop Stand",
    price: "₹400",
    condition: "Excellent",
    description: "Adjustable height, metal finish.",
    img: '/laptop stand.jpg'
  },
  {
    name: "Books",
    price: "₹300",
    condition: "Fair",
    description: "DSA, DBMS, OS, CN – Semester 3 and 4 books.",
    img: '/books.jpg'
  },
  {
    name: "LED Desk Lamp",
    price: "₹250",
    condition: "Like New",
    description: "Rechargeable lamp with brightness control.",
    img: '/lamp.jpg'
  },
  {
    name: "Mini Fridge (50L)",
    price: "₹3500",
    condition: "Good",
    description: "Perfect for a dorm room, keeps drinks and snacks cool.",
    img: '/fridge.jpg'
  },
  {
    name: "Electric Kettle",
    price: "₹500",
    condition: "Like New",
    description: "1.5L capacity, boils water quickly for tea, coffee, or noodles.",
    img: '/kettle.jpg'
  },
  {
    name: "Bicycle",
    price: "₹4000",
    condition: "Fair",
    description: "Single-speed cycle, great for getting around campus and the city.",
    img: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500'
  }
];

const MarketplacePage = () => {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <main className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Student Marketplace
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row overflow-hidden"
            >
              {/* Text Content */}
              <div className="p-6 w-full md:w-2/3">
                <h3 className="text-xl font-semibold text-indigo-700 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Condition: {item.condition}
                </p>
                <p className="text-green-600 font-bold text-lg mb-3">
                  Price: {item.price}
                </p>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>

              {/* Image Container */}
              <div className="w-full md:w-1/3 h-48 md:h-auto">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MarketplacePage;