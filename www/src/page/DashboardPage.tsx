import React, { useEffect, useState } from "react";
import { Box, Card, Chip, Grid, IconButton, Typography } from "@mui/material";
import {
  FaChartBar,
  FaCheckCircle,
  FaDiscord,
  FaGithub,
  FaGoogle,
  FaHourglassHalf,
  FaJira,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { API_BASE_URL } from "@/services/api";
import { listAreas } from "@/services/areaComposition";

type ActivityElement = {
  name: string;
  services: JSX.Element[];
  status: string;
  date: string;
  url: string;
};

type MetricElement = {
  label: string;
  value: number;
  icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
};

const IconMap = {
  GITHUB: <FaGithub />,
  GOOGLE: <FaGoogle />,
  DISCORD: <FaDiscord />,
  JIRA: <FaJira />,
};

const testArea = (url: string) => {
  fetch(url, {
    method: "POST",
    body: JSON.stringify({}),
  });

  alert("Test area executed!");
};

const Dashboard: React.FC = () => {
  const [, setSelectedAutomation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<ActivityElement[]>([]);
  const [metrics, setMetrics] = useState<MetricElement[]>([]);

  useEffect(() => {
    listAreas()
      .then((areas) =>
        areas.map((area) => ({
          name: area.service_name,
          services: [IconMap[area.service_name as keyof typeof IconMap]],
          status: area.event_type,
          date: area.created_at,
          url: `${API_BASE_URL}/area-composition/execute?id=${area.id}`,
        }))
      )
      .then((areaData) => {
        setAreas(areaData);
        const completedCount = areaData.filter(
          (area) => area.status === "success",
        ).length;
        const pendingCount = areaData.filter(
          (area) => area.status === "pending",
        ).length;
        const failedCount = areaData.filter(
          (area) => area.status === "failure",
        ).length;

        setMetrics([
          {
            label: "Completed Automations",
            value: completedCount,
            icon: FaCheckCircle,
            color: "#4CAF50",
          },
          {
            label: "Pending Tasks",
            value: pendingCount,
            icon: FaHourglassHalf,
            color: "#FFC107",
          },
          {
            label: "Failed Automations",
            value: failedCount,
            icon: FaTimesCircle,
            color: "#F44336",
          },
          {
            label: "Total Automations",
            value: areaData.length,
            icon: FaChartBar,
            color: "#5c1ed6",
          },
        ]);
      }).finally(() => setLoading(false));
  }, []);

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
        sx={{ color: "#5c1ed6", mb: 3, fontWeight: "bold" }}
      >
        METRICS OVERVIEW
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading
          ? (
            <div className="flex items-center justify-center h-32">
              <FaSpinner
                className="fa-spin text-blue-500 animate-spin"
                size={32}
              />
            </div>
          )
          : (
            metrics.map((metric, index) => (
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
            ))
          )}
      </Grid>

      <Typography
        variant="h5"
        sx={{ color: "#5c1ed6", mb: 3, fontWeight: "bold" }}
      >
        RECENT ACTIVITIES
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {!areas.length
          ? (
            loading
              ? (
                <div className="flex items-center justify-center h-32">
                  <FaSpinner
                    className="fa-spin text-blue-500 animate-spin"
                    size={32}
                  />
                </div>
              )
              : (
                <div>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    No activities found
                  </Typography>
                </div>
              )
          )
          : (
            areas.map((activity, index) => (
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
                    <Box key={i} sx={{ color: "#5c1ed6", fontSize: 24 }}>
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
                  <Typography variant="body2" color="textSecondary">
                    {activity.url}
                  </Typography>
                </Box>
                <Chip
                  label="Test Area"
                  color={"primary"}
                  variant="outlined"
                  sx={{ fontWeight: "bold", mr: 2 }}
                  onClick={() => testArea(activity.url)}
                />
                <Chip
                  label={activity.status}
                  color={statusColors[
                    activity.status as keyof typeof statusColors
                  ]}
                  variant="outlined"
                  sx={{ fontWeight: "bold", mr: 2 }}
                />
                <IconButton
                  sx={{ color: "#5c1ed6" }}
                  onClick={() => setSelectedAutomation(activity.name)}
                >
                  <FaChartBar />
                </IconButton>
              </Card>
            ))
          )}
      </Box>
    </Box>
  );
};

export default Dashboard;
