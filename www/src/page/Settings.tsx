import { Chip, Box } from "@mui/material";
import React, { useState } from "react";
import ProfilePage from "./Profile";
import ChangePassword from "./ChangePassword";
import ServiceSubscribed from "./ServiceSubscribed";
import DeleteAccount from "./DeleteAccount";

interface SettingsNavigatorProps {
  value: TabKey;
  setValue: (value: TabKey) => void;
}

const SettingsNavigator: React.FC<SettingsNavigatorProps> = ({value, setValue}) => {
  const options = [
    { label: "Profile", value: "profile" },
    { label: "Change Password", value: "changePassword" },
    { label: "Services Subscribed", value: "serviceSubscribed" },
    { label: "Delete Account", value: "deleteAccount" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "row", p: 3}}>
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          variant={value == option.value ? "filled" : "outlined"}
          onClick={() => setValue(option.value as TabKey)}
          sx={{
            mr: 1,
            transition: "background-color 0.3s, color 0.3s",
            cursor: "pointer",
            bgcolor: value === option.value ? "#5A6ACF" : "transparent",
            color: value === option.value ? "#fff" : "#5A6ACF",
            "&:hover": {
              bgcolor: value !== option.value ? "#E0E7FF" : "#5A6ACF",
              color: value !== option.value ? "#5A6ACF" : "#fff",
            },
          }}
        />
      ))}
    </Box>
  );
};

type TabKey = 'profile' | 'changePassword' | 'serviceSubscribed' | 'deleteAccount';

const Settings = () => {
  const [tab, setTab] = useState<TabKey>("profile");
  const tabs = {
    profile: <ProfilePage />,
    changePassword: <ChangePassword />,
    serviceSubscribed: <ServiceSubscribed />,
    deleteAccount: <DeleteAccount />,
  };

  return (
    <div className="flex flex-col text-black">
      <SettingsNavigator value={tab} setValue={setTab} />
      {tabs[tab]}
    </div>
  );
};

export default Settings;
