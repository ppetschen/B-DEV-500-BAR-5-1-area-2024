import React, { useState } from "react";
import { Box, Card, Typography, TextField, Button } from "@mui/material";
import {useNavigate} from "react-router-dom";
import { deleteUser} from "@/services/userManagement";

const DeleteAccount: React.FC = () => {
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const deleted = await deleteUser();
    if (deleted) {
      localStorage.removeItem("token");
      setTimeout(() => navigate("/"), 2000);
    } else {
      console.log("Account deletion failed.");
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#5A6ACF", mb: 6 }}
      >
        DELETE ACCOUNT
      </Typography>
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
        }}
      >
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={deleteEmail}
          onChange={(e) => setDeleteEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleDeleteAccount}
          variant="contained"
          color="error"
          sx={{ bgcolor: "#FF3D00", "&:hover": { bgcolor: "#D32F2F" } }}
        >
          Delete Account
        </Button>
      </Card>
    </Box>
  );
};

export default DeleteAccount;
