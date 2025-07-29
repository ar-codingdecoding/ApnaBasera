import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react';

const TopBar = () => {
  return (
    
    <div className="bg-slate-150 text-gray-700 py-2 border-b">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        <div className="flex space-x-4">
          <Link to="#" className="hover:text-indigo-600 transition-colors">
            <Facebook size={18} />
          </Link>
          <Link to="#" className="hover:text-indigo-600 transition-colors">
            <Twitter size={18} />
          </Link>
          <Link to="#" className="hover:text-indigo-600 transition-colors">
            <Instagram size={18} />
          </Link>
          <Link to="#" className="hover:text-indigo-600 transition-colors">
            <Youtube size={18} />
          </Link>
        </div>

        {/* Contact Info & CTA */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Mail size={20} className="text-red-500" />
            <div>
              <p className="text-sm font-semibold">hello@apnabasera.com</p>
              <p className="text-xs text-gray-500">Drop us a line</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={20} className="text-red-500" />
            <div>
              <p className="text-sm font-semibold">+91 98765 43210</p>
              <p className="text-xs text-gray-500">Make a call</p>
            </div>
          </div>
        
        </div>

      </div>
    </div>
  );
};

export default TopBar;