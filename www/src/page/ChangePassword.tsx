import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button, Alert, CircularProgress } from "@mui/material";
import { updateUser } from "@/services/userManagement";

const ChangePassword: React.FC = () => {
  //const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword !== repeatNewPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setIsLoading(true);

    const updatedUser = await updateUser({ new_password: newPassword });
    setIsLoading(false);

    if (updatedUser && typeof updatedUser !== "boolean") {
      setSuccessMessage("Password changed successfully.");
      setNewPassword("");
      setRepeatNewPassword("");
    } else {
      setErrorMessage("Failed to change password. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#5c1ed6", mb: 4 }}
      >
        CHANGE PASSWORD
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
        {errorMessage && (
          <Alert severity="error" sx={{mb: 2}}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{mb: 2}}>
            {successMessage}
          </Alert>
        )}
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{mb: 2}}
        />
        <TextField
          margin="dense"
          label="Repeat New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={repeatNewPassword}
          onChange={(e) => setRepeatNewPassword(e.target.value)}
          sx={{mb: 2}}
        />
        <Button
          onClick={handlePasswordSave}
          variant="contained"
          sx={{
            bgcolor: "#273240",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "#EDEEF1",
              color: "#273240",
            },
          }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit"/> : "Save Password"}
        </Button>
      </Card>
    </Box>
  );
};

export default ChangePassword;
