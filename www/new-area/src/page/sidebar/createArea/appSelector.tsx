import React, { useState } from 'react';
import { triggerEvents as apps } from './data';
import { FaGithub, FaGoogle, FaFacebook, FaMicrosoft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

interface AppSelectorProps {
  onSelectApp: (app: string) => void;
  onSelectTrigger: (trigger: string) => void;
  title: string;
}

const iconMap: { [key: string]: React.ComponentType } = {
  GitHub: FaGithub,
  Gmail: SiGmail,
  Google: FaGoogle,
  Facebook: FaFacebook,
  Outlook: FaMicrosoft
};

const AppSelector: React.FC<AppSelectorProps> = ({ onSelectApp, onSelectTrigger, title }) => {
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  const handleAppClick = (appName: string) => {
    setExpandedApp(expandedApp === appName ? null : appName);
    setSelectedApp(appName);
    onSelectApp(appName);
  };

  const handleTriggerClick = (trigger: string) => {
    setSelectedTrigger(trigger);
    onSelectTrigger(trigger);
  };

  return (
    <div className="app-selector p-4 bg-[#2d2d2d] rounded-lg h-[800px] w-[400px] overflow-y-auto">
      <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
      <input 
        type="text" 
        placeholder="Search apps..." 
        className="w-full p-2 mb-4 bg-[#3d3d3d] text-white border border-[#3d3d3d] rounded"
      />
      <div className="space-y-4">
        {Object.entries(apps).map(([appName, triggers]) => (
          <div key={appName} className="border border-[#3d3d3d] rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer bg-[#2d2d2d] hover:bg-[#3d3d3d] transition duration-200"
              onClick={() => handleAppClick(appName)}
            >
              <div className="flex it0ems-center">
                {iconMap[appName] && React.createElement(iconMap[appName], { className: "w-6 h-6 mr-2 text-white" })}
                <span className="font-medium text-white">{appName}</span>
              </div>
              {expandedApp === appName ? <FaChevronUp className="text-white" /> : <FaChevronDown className="text-white" />}
            </div>
            {expandedApp === appName && (
              <div className="p-4 bg-[#2d2d2d]">
                <h3 className="mb-2 font-semibold text-white">Trigger Events:</h3>
                <ul className="space-y-2">
                  {triggers.map((trigger) => (
                    <li 
                      key={trigger}
                      className={`cursor-pointer p-2 rounded transition duration-200 ${
                        selectedTrigger === trigger ? 'bg-[#3d3d3d]' : 'hover:bg-[#3d3d3d]'
                      } text-white`}
                      onClick={() => handleTriggerClick(trigger)}
                    >
                      {trigger}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {selectedApp && selectedTrigger && (
        <div className="mt-4 p-4 bg-[#3d3d3d] rounded-lg">
          <h3 className="font-semibold text-white">Selected Automation:</h3>
          <p className="text-white">When {selectedTrigger} in {selectedApp}</p>
        </div>
      )}
    </div>
  );
};

export default AppSelector;
 