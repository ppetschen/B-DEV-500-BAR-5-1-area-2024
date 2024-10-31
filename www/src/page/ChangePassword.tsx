import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button } from "@mui/material";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const handlePasswordSave = () => {
    console.log("Password changed:", { currentPassword, newPassword });
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#5A6ACF", mb: 6 }}
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
        <TextField
          margin="dense"
          label="Current Password"
          type="password"
          fullWidth
          variant="outlined"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Repeat New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={repeatNewPassword}
          onChange={(e) => setRepeatNewPassword(e.target.value)}
          sx={{ mb: 2 }}
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
        >
          Save Password
        </Button>
      </Card>
    </Box>
  );
};

export default ChangePassword;
