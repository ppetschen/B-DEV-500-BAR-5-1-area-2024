import React from 'react';
import { FaGoogle, FaGithub, FaFacebook, FaEnvelope } from 'react-icons/fa';

const ServicesPage: React.FC = () => {
  const services = [
    { name: 'Google', description: '', icon: FaGoogle },
    { name: 'GitHub', description: '', icon: FaGithub },
    { name: 'Facebook', description: '', icon: FaFacebook },
    { name: 'Outlook', description: '', icon: FaEnvelope }, 
  ];

  return (
    <div className="p-8 bg-gray-800 rounded-lg glass-effect">
      <h1 className="mb-6 text-3xl font-bold text-white">Services</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div key={index} className="p-4 transition-shadow duration-200 bg-gray-700 border rounded-lg hover:shadow-lg">
            <div className="flex items-center mb-2">
              <service.icon className="w-6 h-6 mr-2 text-white" />
              <h2 className="text-xl font-semibold text-white">{service.name}</h2>
            </div>
            <p className="text-gray-300">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
