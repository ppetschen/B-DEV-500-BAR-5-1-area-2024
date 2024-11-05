import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { getUser } from "@/services/userManagement";
import { services } from "@/components/layout/ServiceList";

const ServiceSubscribed: React.FC = () => {
  const [subscribedServices, setSubscribedServices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserServices = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const user = await getUser();
      setIsLoading(false);

      if (user && typeof user !== "boolean") {
        setSubscribedServices(user.services || []);
      } else {
        setErrorMessage("Failed to load subscribed services.");
        alert("Failed to load subscribed services.");
      }
    };
    fetchUserServices();
  }, []);

  const subscribedServiceIcons = subscribedServices.map((serviceName) => {
    return services.find(
      (service) => service.name.toLowerCase() === serviceName.toLowerCase()
    );
  });

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#5c1ed6", mb: 4 }}
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
        {isLoading ? (
          <CircularProgress />
        ) : errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : subscribedServices.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {subscribedServiceIcons.map((service, index) =>
              service ? (
                <Box key={index} display="flex" alignItems="center">
                  <Tooltip title={service.name}>
                    <IconButton
                      sx={{
                        bgcolor: "#7901f1",
                        color: "#fff",
                        p: 2,
                        mr: 2,
                        transform: "scale(1)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.2)",
                          bgcolor: "#5c1ed6",
                        },
                      }}
                      size="small"
                    >
                      {React.createElement(service.icon, { size: 24 })}
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : null
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="error">
            You have no subscribed services
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default ServiceSubscribed;
