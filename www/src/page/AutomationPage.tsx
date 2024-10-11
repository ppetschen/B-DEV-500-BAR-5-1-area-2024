import React, { useState } from "react";
import AppSelector from "./appSelector";

const AutomationPage: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  return (
    <div className="p-6 automation-page">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AppSelector
          title="Action:"
          onSelectApp={setSelectedApp}
          onSelectTrigger={setSelectedTrigger}
        />
        {selectedApp && selectedTrigger && (
          <AppSelector
            title="Reaction:"
            onSelectApp={(app) => console.log(`Action app selected: ${app}`)}
            onSelectTrigger={(trigger) =>
              console.log(`Action trigger selected: ${trigger}`)
            }
          />
        )}
      </div>
    </div>
  );
};

export default AutomationPage;
