import React, { useState } from "react";
import { Box, Typography, Grid, Card, Chip, IconButton } from "@mui/material";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaChartBar,
  FaFacebook,
  FaGoogle,
  FaMicrosoft,
  FaGithub,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Dashboard: React.FC = () => {
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(
    null
  );

  const recentActivities = [
    {
      name: "Save new Gmail emails to Google Spreadsheet",
      services: [<SiGmail />, <FaGoogle />],
      status: "Completed",
      date: "2024-10-05",
    },
    {
      name: "Add new Facebook Lead Ads to Google Sheets",
      services: [<FaFacebook />, <FaGoogle />],
      status: "Pending",
      date: "2024-10-06",
    },
    {
      name: "Track GitHub issues in Microsoft Excel",
      services: [<FaGithub />, <FaMicrosoft />],
      status: "Failed",
      date: "2024-10-07",
    },
    {
      name: "Create Trello cards for new Gmail emails",
      services: [<SiGmail />, <FaGoogle />],
      status: "Completed",
      date: "2024-10-08",
    },
  ];

  const metrics = [
    {
      label: "Most Used Automation",
      value: 120,
      icon: FaCheckCircle,
      color: "#5A6ACF",
    },
    {
      label: "Pending Tasks",
      value: 35,
      icon: FaHourglassHalf,
      color: "#FFC107",
    },
    {
      label: "Completed Automations",
      value: 80,
      icon: FaCheckCircle,
      color: "#4CAF50",
    },
    {
      label: "New Notifications",
      value: 5,
      icon: FaTimesCircle,
      color: "#F44336",
    },
  ];

  const statusIcons = {
    Completed: <FaCheckCircle color="#4CAF50" />,
    Pending: <FaHourglassHalf color="#FFC107" />,
    Failed: <FaTimesCircle color="#F44336" />,
  };

  const statusColors: {
    [key in "Completed" | "Pending" | "Failed"]:
      | "success"
      | "warning"
      | "error";
  } = {
    Completed: "success",
    Pending: "warning",
    Failed: "error",
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#F7F7F9", minHeight: "100vh" }}>
      <Typography
        variant="h5"
        sx={{ color: "#5A6ACF", mb: 3, fontWeight: "bold" }}
      >
        MOST USED AUTOMATION
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={3} key={index}>
            <Card
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <Box sx={{ color: "#fff", mr: 2 }}>
                {React.createElement(metric.icon, {
                  size: 24,
                  color: metric.color,
                })}
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#273240" }}
                >
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {metric.label}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography
        variant="h5"
        sx={{ color: "#5A6ACF", mb: 3, fontWeight: "bold" }}
      >
        RECENT ACTIVITIES
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {recentActivities.map((activity, index) => (
          <Card
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": {
                boxShadow: 6,
                backgroundColor: "#EDEEF1",
              },
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              {activity.services.map((ServiceIcon, i) => (
                <Box key={i} sx={{ color: "#5A6ACF", fontSize: 24 }}>
                  {ServiceIcon}
                </Box>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#273240" }}
              >
                {activity.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {activity.date}
              </Typography>
            </Box>
            <Chip
              label={activity.status}
              color={statusColors[activity.status as keyof typeof statusColors]}
              variant="outlined"
              sx={{ fontWeight: "bold", mr: 2 }}
            />
            <IconButton
              sx={{ color: "#5A6ACF" }}
              onClick={() => setSelectedAutomation(activity.name)}
            >
              <FaChartBar />
            </IconButton>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
