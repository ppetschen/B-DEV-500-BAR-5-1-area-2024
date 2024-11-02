import React, { useState, useEffect } from "react";
import { Box, Card, Typography, Stack, CircularProgress, Alert } from "@mui/material";
import {getUser} from "@/services/userManagement";

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
      }
    };
    fetchUserServices();
  }, []);

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
        {isLoading ? (
          <CircularProgress />
        ) : errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : subscribedServices.length > 0 ? (
          <Stack spacing={1}>
          {subscribedServices.map((service, index) => (
            <Typography key={index} variant="body2" color="textSecondary">
              • {service}
            </Typography>
          ))}
        </Stack>
        ) : (
          <Typography variant="body2" color="textSecondary">You have no subscribed services</Typography>
        )}
      </Card>
    </Box>
  );
};

export default ServiceSubscribed;
