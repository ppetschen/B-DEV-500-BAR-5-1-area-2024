import React from "react";
import AppSelector from "./appSelector";
import { setupArea } from "@/services/areaComposition";

type One = Parameters<Parameters<typeof AppSelector>[0]["onComplete"]>;

const createArea = async (...[action, reaction]: One) => {
  const payload = {
    from_service_name: action.app.toUpperCase(),
    from_event_type: action.event_type.split(" ").join("_").toUpperCase(),
    from_payload: typeof action.payload === "string"
      ? JSON.parse(action.payload)
      : action.payload,
    to_service_name: reaction.app.toUpperCase(),
    to_execution_endpoint: reaction.webhookUrl,
  };

  const data = await setupArea(payload);
  if (!data) {
    console.error("Failed to create area");
    return;
  }
};

const AutomationPage: React.FC = () => {
  return (
    <div className="p-6">
      <div>
        <AppSelector
          title="Action:"
          onComplete={createArea}
        />
      </div>
    </div>
  );
};

export default AutomationPage;
