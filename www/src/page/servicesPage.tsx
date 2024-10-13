import React from "react";
import { FaEnvelope, FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";

const ServicesPage: React.FC = () => {
  const services = [
    {
      name: "Google",
      description: "Google is a search engine",
      icon: FaGoogle,
    },
    {
      name: "GitHub",
      description: "GitHub is a code hosting platform",
      icon: FaGithub,
    },
    {
      name: "Facebook",
      description: "Facebook is a social media platform",
      icon: FaFacebook,
    },
    {
      name: "Outlook",
      description: "Outlook is an email service",
      icon: FaEnvelope,
    },
  ];

  const handleServiceClick = (serviceName: string) => {
    console.log(`Clicked on ${serviceName}`);
    const service = serviceName.toLowerCase();
    window.location.href =
      `${import.meta.env.VITE_API_BASE_URL}/service-management/auth/${service}`;
  };

  return (
    <div className="p-8 rounded-lg glass-effect">
      <h1 className="mb-6 text-3xl font-bold text-[#5A6ACF]">Services</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <button
            key={index}
            className="p-4 bg-[#5A6ACF] border rounded-lg transition-shadow duration-200 hover:shadow-lg focus:outline-none w-full h-full"
            onClick={() => handleServiceClick(service.name)}
          >
            <div className="flex items-center mb-2">
              <service.icon className="w-6 h-6 mr-3 text-white" />
              <h2 className="text-xl font-semibold text-white">
                {service.name}
              </h2>
            </div>
            <p className="text-gray-300">{service.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
