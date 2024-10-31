import React, {useState} from "react";
import {Box, Grid, Card, Typography, IconButton, Chip} from '@mui/material';
import { FaFacebook, FaGithub, FaGoogle, FaDiscord, FaTwitch} from "react-icons/fa";
import { SiMicrosoftoutlook } from 'react-icons/si';
import Tooltip from '@mui/material/Tooltip';
import { authenticateToService } from "@/services/serviceManagement";

const ServicesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const services = [
    {
      name: "Google",
      description: "Google is a search engine",
      icon: FaGoogle,
      category: 'Productivity',
    },
    {
      name: "GitHub",
      description: "GitHub is a code hosting platform",
      icon: FaGithub,
      category: 'Developer Tools',
    },
    {
      name: "Facebook",
      description: "Facebook is a social media platform",
      icon: FaFacebook,
      category: 'Advertising',
    },
    {
      name: "Outlook",
      description: "Outlook is an email service",
      icon: SiMicrosoftoutlook,
      category: 'Productivity',
    },
    {
      name: "Discord",
      description: "Discord is a communication platform",
      icon: FaDiscord,
      category: 'Communication',
    },
    {
      name: "Twitch",
      description: "Twitch is a live-stream platform",
      icon: FaTwitch,
      category: 'Live-streaming',
    }
  ];

  const handleServiceClick = (serviceName: string) => {
    const service = serviceName.toLowerCase();
    authenticateToService(service);
  };

  const filteredServices = selectedCategory ? services.filter(service => service.category === selectedCategory) : services;

  return (
    <Box sx={{ p: 4, bgcolor: '#F7F7F9', minHeight: '100vh' }}>
      < Typography variant="h4" sx={{fontWeight: 'bold', color: '#5A6ACF', mb: 6}}>
        SERVICES
      </Typography>

      <Box sx={{mb: 2}}>
        {['All', 'Advertising', 'Productivity', 'Communication', 'Developer Tools', 'Live-streaming'].map((category) => (
          <Chip
            key={category}
            label={category}
            variant={selectedCategory === category ? 'filled': 'outlined'}
            onClick={() => setSelectedCategory(category === 'All' ? null: category)}
            sx={{
              mr: 1,
              transition: 'background-color 0.3s, color 0.3s',
              cursor: 'pointer',
              bgcolor: selectedCategory === category ? '#5A6ACF' : 'transparent',
              color: selectedCategory === category ? '#fff' : '#5A6ACF', '&:hover' : {
                bgcolor: selectedCategory !== category ? '#E0E7FF' : '#5A6ACF',
                color: selectedCategory !== category ? '#5A6ACF' : '#fff',
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                backgroundColor: '#fff',
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
              }}
            >
              <Tooltip title={service.name} arrow>
                <IconButton
                  sx={{ bgcolor: '#5A6ACF', color: '#fff', p: 2, mb: 2}}
                  onClick={() => handleServiceClick(service.name)}
                >
                  {React.createElement(service.icon, { size: 32})}
                </IconButton>
              </Tooltip>

              <Typography variant="h6" sx={{color: '#273240', fontWeight: 'bold', mb: 1}}>
                {service.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', mb: 2}}>
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
