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

type Reaction =
  | {
    app: "Discord";
    trigger: string;
    message_content: string;
    webhook_url: string;
  }
  | {
      app: "Google";
      trigger: string;
      file_name: string;
      file_content: string
    }
  | {
    app: "Twitch";
    trigger: "Subscription";
    alert_message: string;
  }
| {
    app: "Twitch";
    trigger: "Clip Created";
    clip_url: string;
    webhook_url: string;
  };

interface Action {
  app: string;
  event_type: string;
  payload: unknown;
}

interface AppSelectorProps {
  title: string;
  onComplete: (action: Action, reaction: Reaction) => void;
}

const AppSelector: React.FC<AppSelectorProps> = ({ title, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [actionSource, setActionSource] = useState<string>("");
  const [actionKind, setActionKind] = useState<string>("");
  const [reactionDestination, setReactionDestination] = useState<string>("");
  const [reactionKind, setReactionKind] = useState<string>("");
  const [reactionPayload, setReactionPayload] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileContent, setFileContent] = useState<string>("");

  const steps = ["Select Action", "Configure Reaction"];

  const actionOptions = {
    Google: ["Sheet Created", "File Uploaded", "Calendar Event"],
    Github: ["Issue Created", "Pull Request Created", "Commit Added"],
    Outlook: ["Email Dispatched"],
    Jira: ["Issue Created", "Issue Updated", "Issue Deleted"],
    Twitch: ["Stream Started", "Clip Created", "Subscription"],
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const reactionData: Reaction = reactionDestination === "Discord"
        ? {
            app: "Discord",
            trigger: reactionKind,
            message_content: reactionPayload,
            webhook_url: webhookUrl,
          }
        : reactionDestination === "Google"
        ? {
            app: "Google",
            trigger: reactionKind,
            file_name: fileName,
            file_content: fileContent,
          }
        : reactionDestination === "Twitch" && reactionKind === "Subscription"
        ? {
            app: "Twitch",
            trigger: "Subscription",
            alert_message: reactionPayload,
          }
        : {
            app: "Twitch",
            trigger: "Clip Created",
            clip_url: reactionPayload,
            webhook_url: webhookUrl,
          };
  
      onComplete(
        { app: actionSource, event_type: actionKind, payload: reactionPayload },
        reactionData,
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
                    setActionKind("");
                  }}
                >
                  <MenuItem value="Google">Google</MenuItem>
                  <MenuItem value="Github">Github</MenuItem>
                  <MenuItem value="Outlook">Outlook</MenuItem>
                  <MenuItem value="Jira">Jira</MenuItem>
                  <MenuItem value="Twitch">Twitch</MenuItem>
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
                      .map(
                        (action) => (
                          <MenuItem key={action} value={action}>
                            {action}
                          </MenuItem>
                        ),
                      )}
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
                    setReactionKind("");
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

            {reactionDestination === "Discord" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Message Content"
                    multiline
                    fullWidth
                    value={reactionPayload}
                    onChange={(e) => setReactionPayload(e.target.value)}
                    placeholder="Enter message content for Discord"
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
              </>
            )}

            {reactionDestination === "Google" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="File Name"
                    fullWidth
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter the file name for Google Drive"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="File Content"
                    multiline
                    fullWidth
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="Enter the file content for Google Drive"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            sx={{
              mr: 2,
              bgcolor: "#5c1ed6",
              color: "#FFFFFF",
              "&:hover": {
                bgcolor: "#EDEEF1",
                color: "#5c1ed6",
              },
            }}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{
            bgcolor: "#5c1ed6",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "#EDEEF1",
              color: "#5c1ed6",
            },
          }}
          >
          {activeStep === steps.length - 1 ? "Complete" : "Next"}
        </Button>
      </Box>
    </Card>
  );
};

export default AppSelector;
