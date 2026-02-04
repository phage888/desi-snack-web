import React from 'react';
import { Clock, Mail } from 'lucide-react';

const BusinessInfo = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Hours Section */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Opening Hours</p>
          <p className="text-lg font-medium text-gray-900">10:00 AM - 11:00 PM</p>
        </div>
      </div>

      {/* Email Section */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-100 text-green-600 rounded-full">
          <Mail size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email Us</p>
          <a 
            href="deepikaskitchendiary@gmail.com" 
            className="text-lg font-medium text-blue-600 hover:underline"
          >
            hello@yourwebsite.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;