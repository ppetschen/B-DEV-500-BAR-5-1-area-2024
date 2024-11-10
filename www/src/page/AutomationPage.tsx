import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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
  Card,
} from "@mui/material";
import {
  composeArea,
  getAvailableAreas,
  getCompletions,
} from "@/services/areaComposition";

export default function Workflow() {
  const [error, setError] = useState<string | null>(null);
  const [areas, setAreas] = useState<{
    actions: string[];
    reactions: string[];
  } | null>(null);
  const [completions, setCompletions] = useState<{
    from: { data: Record<string, unknown>[] };
    to: { data: Record<string, unknown>[] };
  } | null>(null);
  const [action, setAction] = useState<string>("");
  const [reaction, setReaction] = useState<string>("");
  const [actionContents, setActionContents] = useState<Record<string, string> | null>(null);
  const [reactionContents, setReactionContents] = useState<Record<string, string> | null>(null);
  const [content, setContent] = useState<string>("");
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Select Action and Reaction", "Configure Contents", "Define Content"];

  useEffect(() => {
    getAvailableAreas()
      .then((data) => {
        setAreas(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "An error occurred");
      });
  }, []);

  useEffect(() => {
    if (action && reaction) {
      getCompletions({ from: action, to: reaction })
        .then((data) => {
          setCompletions({
            from: data.from as any,
            to: data.to as any,
          });
          setError(null);
        })
        .catch((err) => {
          setError(err.message || "An error occurred");
        });
    }
  }, [action, reaction]);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderDynamicDropdowns = (
    data: Record<string, unknown>[],
    setSelectedContent: React.Dispatch<React.SetStateAction<Record<string, string> | null>>,
    contentType: string
  ) => {
    const uniqueKeys = new Set<string>();

    data
      .flatMap((item) => Object.keys(item))
      .forEach((key) => uniqueKeys.add(key));

    return Array.from(uniqueKeys).map((key) => (
      <Grid item xs={12} key={key}>
        <FormControl fullWidth>
          <InputLabel>{key}</InputLabel>
          <Select
            value={
              contentType === "action"
                ? actionContents?.[key] || ""
                : reactionContents?.[key] || ""
            }
            label={key}
            onChange={(event) => {
              setSelectedContent((prev) => ({
                ...prev,
                [key]: event.target.value as string,
              }));
            }}
          >
            {data
              .filter((elem) => elem[key])
              .map((elem) => (
                <MenuItem
                  key={`${key}-${JSON.stringify(elem)}`}
                  value={String(elem[key])}
                >
                  {String(elem[key])}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
    ));
  };

  const handleSubmit = async () => {
    const { reaction_id, action_id } = await composeArea({
      from: {
        type: action as string,
        context: actionContents,
      },
      to: {
        type: reaction as string,
        context: reactionContents,
      },
      markup: content,
    });

    if (reaction_id && action_id) {
      navigate("/dashboard");
    } else {
      setError("Failed to create AREA");
      setAction("");
      setReaction("");
      setActionContents(null);
      setReactionContents(null);
      setContent("");
      setActiveStep(0);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        pt: 6,
        bgcolor: "#F7F7F9",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#5c1ed6", mb: 5 }}
      >
        NEW AREA
      </Typography>

      {error && (
        <Typography color="error" align="center" gutterBottom>
          Error: {error}
        </Typography>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  color: '#5c1ed6',
                },
                '& .Mui-completed .MuiStepLabel-label': {
                  color: '#5c1ed6',
                },
                '& .Mui-active .MuiStepLabel-label': {
                  color: '#5c1ed6',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Action</InputLabel>
                <Select
                  value={action}
                  label="Action"
                  onChange={(event) => {
                    setAction(event.target.value as string);
                    setReaction("");
                    setCompletions(null);
                  }}
                >
                  {areas?.actions.map((actionOption) => (
                    <MenuItem key={actionOption} value={actionOption}>
                      {actionOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Reaction</InputLabel>
                <Select
                  value={reaction}
                  label="Reaction"
                  onChange={(event) => {
                    setReaction(event.target.value as string);
                  }}
                  disabled={!action}
                >
                  {areas?.reactions.map((reactionOption) => (
                    <MenuItem key={reactionOption} value={reactionOption}>
                      {reactionOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeStep === 1 && completions && (
        <Box>
          <Typography
            variant="h6"
            sx={{ color: "#5c1ed6", fontWeight: "bold", mt: 4, mb: 2 }}
          >
            Configure Action Content
          </Typography>
          <Card sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              {renderDynamicDropdowns(
                completions.from.data,
                setActionContents,
                "action"
              )}
            </Grid>
          </Card>

          <Typography
            variant="h6"
            sx={{ color: "#5c1ed6", fontWeight: "bold", mt: 4, mb: 2 }}
          >
            Configure Reaction Content
          </Typography>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {renderDynamicDropdowns(
                completions.to.data,
                setReactionContents,
                "reaction"
              )}
            </Grid>
          </Card>
        </Box>
      )}

      {activeStep === 2 && (
        <Box>
          <Typography
            variant="h6"
            sx={{ color: "#5c1ed6", fontWeight: "bold", mt: 4, mb: 2 }}
          >
            Define Content
          </Typography>
          <Card sx={{ p: 3 }}>
            <TextField
              label="Content"
              variant="outlined"
              placeholder="Supports EJS"
              multiline
              fullWidth
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Card>
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
                bgcolor: "#7901f1",
              },
            }}
          >
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
              bgcolor: "#7901f1",
            },
          }}
          disabled={
            (activeStep === 0 && (!action || !reaction)) ||
            (activeStep === 1 && (!actionContents || !reactionContents)) ||
            (activeStep === 2 && !content)
          }
        >
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}