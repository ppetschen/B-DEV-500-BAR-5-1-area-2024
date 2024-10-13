import React from 'react';
import { FaGoogle, FaGithub, FaFacebook, FaEnvelope } from 'react-icons/fa';

const ServicesPage: React.FC = () => {
  const services = [
    { name: 'Google', description: '', icon: FaGoogle },
    { name: 'GitHub', description: '', icon: FaGithub },
    { name: 'Facebook', description: '', icon: FaFacebook },
    { name: 'Outlook', description: '', icon: FaEnvelope },
  ];

  const handleServiceClick = (serviceName: string) => {
    console.log(`Clicked on ${serviceName}`);
    const service = serviceName.toLowerCase();
    window.location.href = `http://localhost:8000/service-management/auth/${service}`;
  };

  return (
    <div className="p-8 rounded-lg glass-effect">
      <h1 className="mb-6 text-3xl font-bold text-[#5A6ACF]">Services</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div key={index} className="p-4 transition-shadow duration-200 bg-[#5A6ACF] border rounded-lg hover:shadow-lg">
          <button
            key={index}
            className="p-4 transition-shadow duration-200 bg-[#5A6ACF] border rounded-lg hover:shadow-lg focus:outline-none"
            onClick={() => handleServiceClick(service.name)}
          ></button>
            <div className="flex items-center mb-2">
              <service.icon className="w-6 h-6 mr-2 text-[white]" />
              <h2 className="text-xl font-semibold text-white">{service.name}</h2>
            </div>
            <p className="text-[gray-300]">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
