import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

interface AppSelectorProps {
  title: string;
  onComplete: (
    action: { app: string; event_type: string; payload: unknown },
    reaction: { app: string; trigger: string; webhookUrl: string },
  ) => void;
}

const AppSelector: React.FC<AppSelectorProps> = ({ title, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [actionSource, setActionSource] = useState<string>("");
  const [actionKind, setActionKind] = useState<string>("");
  const [reactionDestination, setReactionDestination] = useState<string>("");
  const [reactionKind, setReactionKind] = useState<string>("");
  const [reactionPayload, setReactionPayload] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");

  const steps = ["Select Action", "Configure Reaction"];

  const actionOptions = {
    Google: ["Sheet Created", "File Uploaded", "Calendar Event"],
    Github: ["Issue Created", "Pull Request Created", "Commit Added"],
    Outlook: ["Email Dispatched"],
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onComplete?.(
        { app: actionSource, event_type: actionKind, payload: reactionPayload },
        { app: reactionDestination, trigger: reactionKind, webhookUrl },
      );
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Action Source</InputLabel>
                <Select
                  value={actionSource}
                  label="Action Source"
                  onChange={(e) => {
                    setActionSource(e.target.value as string);
                    setActionKind(""); // Reset action kind when source changes
                  }}
                >
                  <MenuItem value="Google">Google</MenuItem>
                  <MenuItem value="Github">Github</MenuItem>
                  <MenuItem value="Outlook">Outlook</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Action Kind</InputLabel>
                <Select
                  value={actionKind}
                  label="Action Kind"
                  onChange={(e) => setActionKind(e.target.value as string)}
                  disabled={!actionSource}
                >
                  {actionSource &&
                    actionOptions[actionSource as keyof typeof actionOptions]
                      .map((action) => (
                        <MenuItem key={action} value={action}>
                          {action}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeStep === 1 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Reaction Destination</InputLabel>
                <Select
                  value={reactionDestination}
                  label="Reaction Destination"
                  onChange={(e) => {
                    setReactionDestination(e.target.value as string);
                    setReactionKind(""); // Reset reaction kind when destination changes
                  }}
                >
                  <MenuItem value="Discord">Discord</MenuItem>
                  <MenuItem value="Google">Google</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Reaction Kind</InputLabel>
                <Select
                  value={reactionKind}
                  label="Reaction Kind"
                  onChange={(e) => setReactionKind(e.target.value as string)}
                  disabled={!reactionDestination}
                >
                  {reactionDestination === "Discord" && (
                    <MenuItem value="Webhook">Discord Webhook</MenuItem>
                  )}
                  {reactionDestination === "Google" && (
                    <MenuItem value="DriveFile">Google Drive File</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Reaction Payload (JSON)"
                multiline
                fullWidth
                value={reactionPayload}
                onChange={(e) => setReactionPayload(e.target.value)}
                placeholder='{"key": "value"}'
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Webhook URL"
                fullWidth
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        {activeStep > 0 && (
          <Button onClick={handleBack} sx={{ mr: 2 }}>
            Back
          </Button>
        )}
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Complete" : "Next"}
        </Button>
      </Box>
    </Card>
  );
};

export default AppSelector;
