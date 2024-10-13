import React, { useState } from 'react';
import { Box, Typography, Card, Grid, Stepper, Step, StepLabel, Button } from '@mui/material';
import { FaGithub, FaGoogle, FaFacebook, FaMicrosoft } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import { isUserSubscribedToService } from '@/services/serviceManagement';
import { IconType } from 'react-icons/lib';

interface AppSelectorProps {
  title: string;
  onSelectApp: (app: string) => void;
  onSelectTrigger: (trigger: string) => void;
  onComplete?: (action: { app: string, trigger: string }, reaction: { app: string, trigger: string }) => void;
}

// Define a type for the valid keys of the iconMap and apps objects
type AppNames = 'GitHub' | 'Gmail' | 'Google' | 'Facebook' | 'Outlook';

// Create a mapping of icons for each app
const iconMap: Record<AppNames, IconType> = {
  GitHub: FaGithub,
  Gmail: SiGmail,
  Google: FaGoogle,
  Facebook: FaFacebook,
  Outlook: FaMicrosoft,
};

// Create a mapping of apps and their triggers
const apps: Record<AppNames, string[]> = {
  GitHub: ['New Issue', 'New Pull Request'],
  Gmail: ['New Email', 'Starred Email'],
  Google: ['New Sheet Row', 'Updated Sheet Row'],
  Facebook: ['New Lead', 'New Comment'],
  Outlook: ['New Email', 'Event Created'],
};

const steps = ['Select Action App', 'Select Action Trigger', 'Select Reaction App', 'Select Reaction Trigger', 'Review Automation'];

const AppSelector: React.FC<AppSelectorProps> = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedActionApp, setSelectedActionApp] = useState<AppNames | null>(null);
  const [selectedActionTrigger, setSelectedActionTrigger] = useState<string | null>(null);
  const [selectedReactionApp, setSelectedReactionApp] = useState<AppNames | null>(null);
  const [selectedReactionTrigger, setSelectedReactionTrigger] = useState<string | null>(null);

  const handleAppClick = async (appName: AppNames) => {
    const service = appName.toLowerCase();
    const response = await isUserSubscribedToService(service);
    if (!response) {
      alert("You need to subscribe to this service first, go to the services page to subscribe.");
    }
    else {
      if (activeStep === 0) {
        setSelectedActionApp(appName);
        setActiveStep(1);
      } else if (activeStep === 2) {
        setSelectedReactionApp(appName);
        setActiveStep(3);
      }
      else { alert("An error occured") };
    }
  };

  const handleTriggerClick = (trigger: string) => {
    if (activeStep === 1) {
      setSelectedActionTrigger(trigger);
      setActiveStep(2);
    } else if (activeStep === 3) {
      setSelectedReactionTrigger(trigger);
      setActiveStep(4); // Move to Review Automation step
    }
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const renderAppSelection = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      {Object.keys(apps).map((appName) => {
        const Icon = iconMap[appName as AppNames]; // Type assertion to AppNames
        return (
          <Card
            key={appName}
            onClick={() => handleAppClick(appName as AppNames)} // Type assertion to AppNames
            sx={{
              p: 3,
              width: '150px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              boxShadow: 3,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            <Icon size={32} color="#5A6ACF" />
            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
              {appName}
            </Typography>
          </Card>
        );
      })}
    </Box>
  );

  const renderTriggerSelection = (app: AppNames) => (
    <Grid container spacing={2}>
      {apps[app].map((trigger) => (
        <Grid item xs={12} key={trigger}>
          <Card
            onClick={() => handleTriggerClick(trigger)}
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#fff',
              boxShadow: 3,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {trigger}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderReviewAutomation = () => (
    <Box sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#5A6ACF', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
        Review Automation
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        {selectedActionApp && (
          <>
            {React.createElement(iconMap[selectedActionApp], { size: 40, color: "#fff" })}
            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>{selectedActionApp}</Typography>
          </>
        )}
        <Typography variant="body1" sx={{ color: '#fff' }}> - {selectedActionTrigger}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {selectedReactionApp && (
          <>
            {React.createElement(iconMap[selectedReactionApp], { size: 40, color: "#fff" })}
            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>{selectedReactionApp}</Typography>
          </>
        )}
        <Typography variant="body1" sx={{ color: '#fff' }}> - {selectedReactionTrigger}</Typography>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'white', color: '#5A6ACF', '&:hover': { backgroundColor: '#F7F7F9' } }}
          onClick={() => onComplete && onComplete(
            { app: selectedActionApp!, trigger: selectedActionTrigger! },
            { app: selectedReactionApp!, trigger: selectedReactionTrigger! }
          )}
        >
          Complete Automation
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: '#F7F7F9', borderRadius: 2, width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#5A6ACF', mb: 10 }}>
        Automation Setup
      </Typography>

      {/* Stepper for visual progress */}
      <Stepper activeStep={activeStep} sx={{ mb: 8 }} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} onClick={() => handleStepClick(index)} sx={{ cursor: 'pointer' }}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Display selection based on step */}
      {activeStep === 0 && renderAppSelection()}
      {activeStep === 1 && selectedActionApp && renderTriggerSelection(selectedActionApp)}
      {activeStep === 2 && renderAppSelection()}
      {activeStep === 3 && selectedReactionApp && renderTriggerSelection(selectedReactionApp)}
      {activeStep === 4 && renderReviewAutomation()} {/* Review Automation step */}
    </Box>
  );
};

export default AppSelector;
