import React from 'react';


const servicesData = [
  {
    title: 'Mess & Tiffin Service',
    description: 'Home-cooked meals delivered to your PG/flat. Monthly and weekly subscriptions available.',
    img: '/tiffin.jpg',
  },
  {
    title: 'Room Cleaning',
    description: 'Affordable daily or weekly room cleaning and maintenance for student accommodations.',
    img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
  },
  {
    title: 'Photocopy & Printing',
    description: 'Find nearby shops for assignments, ID prints, project binding and spiral notebooks.',
    img: '/photocopy.jpg',
  },
  {
    title: 'Laundry Service',
    description: 'Convenient pick-up and drop-off laundry services to save you time and effort.',
    img: '/laundary.jpg',
  },
  {
    title: 'Co-working Spaces',
    description: 'Access quiet and productive co-working spaces near your location for focused study sessions.',
    img: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500',
  },
  {
    title: 'Two-Wheeler Rentals',
    description: 'Rent scooters or bikes on an hourly or daily basis for easy and affordable travel.',
    img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500',
  },
];

const ServicesPage = () => {
  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <main className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Student Services
        </h2>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden"
            >
              
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 flex-grow">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ServicesPage;