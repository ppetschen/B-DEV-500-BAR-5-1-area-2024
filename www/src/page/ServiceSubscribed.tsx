import React, { useState } from "react";
import { Box, Card, Typography, Stack } from "@mui/material";

const ServiceSubscribed: React.FC = () => {
  const [userData] = useState({
    subscribedServices: [
      "Google Analytics",
      "Slack",
      "GitHub",
      "Facebook Ads",
      "Zoom",
      "Dropbox",
    ],
  });

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#5A6ACF", mb: 6 }}
      >
        SERVICES SUBSCRIBED
      </Typography>
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
          mb: 4,
        }}
      >
        <Stack spacing={1}>
          {userData.subscribedServices.map((service, index) => (
            <Typography key={index} variant="body2" color="textSecondary">
              • {service}
            </Typography>
          ))}
        </Stack>
      </Card>
    </Box>
  );
};

export default ServiceSubscribed;
