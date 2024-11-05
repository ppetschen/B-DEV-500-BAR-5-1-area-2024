import React, { useState } from "react";
import { Box, Card, Chip, Grid, IconButton, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { authenticateToService } from "@/services/serviceManagement";
import { services } from "@/components/layout/ServiceList";

const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleServiceClick = (serviceName: string) => {
    const service = serviceName.toLowerCase();
    authenticateToService(service);
  };

  const filteredServices = selectedCategory
    ? services.filter((service) => service.category === selectedCategory)
    : services;

  return (
    <Box sx={{ p: 4, pt: 6, bgcolor: "#F7F7F9", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#5c1ed6", mb: 5 }}
      >
        SERVICES
      </Typography>

      <Box sx={{ mb: 4 }}>
        {[
          "All",
          "Advertising",
          "Productivity",
          "Communication",
          "Developer Tools",
          "Live-streaming",
        ].map((category) => (
          <Chip
            key={category}
            label={category}
            variant={
              selectedCategory === category ||
              (category === "All" && selectedCategory === null)
                ? "filled"
                : "outlined"
            }
            onClick={() =>
              setSelectedCategory(category === "All" ? null : category)
            }
            sx={{
              mr: 1,
              transition: "background-color 0.3s, color 0.3s",
              cursor: "pointer",
              bgcolor:
                selectedCategory === category ||
                (category === "All" && selectedCategory === null)
                  ? "#5c1ed6"
                  : "transparent",
              color:
                selectedCategory === category ||
                (category === "All" && selectedCategory === null)
                  ? "#fff"
                  : "#5c1ed6",
              className: "lexend-deca-bold",
              "&:hover": {
                bgcolor:
                  selectedCategory !== category &&
                  !(category === "All" && selectedCategory === null)
                    ? "#E0E7FF"
                    : "#5c1ed6",
                color:
                  selectedCategory !== category &&
                  !(category === "All" && selectedCategory === null)
                    ? "#5c1ed6"
                    : "#fff",
              },
            }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {filteredServices.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#fff",
                boxShadow: 3,
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <Tooltip title={service.name} arrow>
                <IconButton
                  sx={{
                    bgcolor: "#7901f1",
                    color: "#fff",
                    p: 2,
                    mb: 2,
                    transition: "background-color 0.3s",
                    "&:hover": {
                      bgcolor: "#5c1ed6",
                    },
                  }}
                  onClick={() => handleServiceClick(service.name)}
                >
                  {React.createElement(service.icon, { size: 32 })}
                </IconButton>
              </Tooltip>
              <Typography
                variant="h6"
                sx={{ color: "#273240", fontWeight: "bold", mb: 1 }}
              >
                {service.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 2 }}>
                {service.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesPage;

//5c1ed6
