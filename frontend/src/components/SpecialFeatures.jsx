import React from 'react';
import { BadgeCheck, Store, Clock } from 'lucide-react';

const features = [
  {
    icon: <BadgeCheck size={40} className="text-indigo-500 group-hover:text-white transition-colors duration-300" />,
    title: 'Verified PGs & Flats',
    description: 'No scams. Every listing is reviewed by our team to ensure quality and safety.',
  },
  {
    icon: <Store size={40} className="text-indigo-500 group-hover:text-white transition-colors duration-300" />,
    title: 'Student Marketplace',
    description: 'Buy and sell books, furniture, and other essentials with zero commission fees.',
  },
  {
    icon: <Clock size={40} className="text-indigo-500 group-hover:text-white transition-colors duration-300" />,
    title: 'Mess & Cleaning Services',
    description: 'Easily book daily meals, laundry, and room cleaning services from trusted vendors.',
  },
];

const SpecialFeatures = () => {
  return (
    
    <section
      className="relative py-16"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', 
      }}
    >
      
      <div className="absolute inset-0 bg-gray-100 bg-opacity-50"></div>

      
      <div className="relative container mx-auto text-center px-6">
        <h3 className="text-3xl font-bold mb-12 text-gray-800">What Makes ApnaBasera Special?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white p-8 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div
                className="absolute bottom-0 left-0 w-full h-full bg-custom-navy transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-in-out"
                style={{ originY: 'bottom' }}
              ></div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialFeatures;