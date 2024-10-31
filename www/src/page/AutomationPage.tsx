import React from "react";
import AppSelector from "./AppSelector";
import { setupArea } from "@/services/areaComposition";

type One = Parameters<Parameters<typeof AppSelector>[0]["onComplete"]>;

const createArea = async (...[action, reaction]: One) => {
  const payload = {
    from_service_name: action.app.toUpperCase(),
    from_event_type: action.event_type.split(" ").join("_").toUpperCase(),
    from_payload: reaction.app === "Google"
      ? {
        name: reaction.file_name,
        content: reaction.file_content,
      }
      : {
        content: action.payload,
      },
    to_service_name: reaction.app.toUpperCase(),
    to_execution_endpoint: reaction.app === "Discord"
      ? reaction.webhook_url
      : reaction.file_name,
  };

  const data = await setupArea(payload);
  if (!data) {
    console.error("Failed to create area");
    return;
  }

  alert(`Area created successfully!`);

  window.location.href = `/dashboard`;
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
