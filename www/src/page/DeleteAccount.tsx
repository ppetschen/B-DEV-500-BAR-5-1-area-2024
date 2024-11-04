import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "@/services/userManagement";

const DeleteAccount: React.FC = () => {
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isFormValid = deleteEmail.trim() !== "" && deletePassword.trim() !== "";

  const isAxiosError = (
    error: unknown
  ): error is { response: { data: { message: string } } } =>
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    "data" in (error as any).response;

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const success = await deleteUser();
      setLoading(false);
      if (success) {
        setSnackbarMessage("success");
        setSnackbarMessage("Account deleted successfully.");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/"), 2000);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Failed to delete account.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error deleting account:", error);

      const errorMessage = isAxiosError(error)
        ? error.response.data.message
        : "An error occurred while deleting the account. Please try again.";
      setSnackbarSeverity("error");
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#5c1ed6", mb: 4 }}
      >
        DELETE ACCOUNT
      </Typography>
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": { boxShadow: 6 },
          backgroundColor: "#FFFFFF",
        }}
      >
        {openSnackbar && snackbarSeverity === "success" && (
          <Alert
            severity={snackbarSeverity}
            sx={{ mb: 2, width: "100%" }}
            onClose={() => setOpenSnackbar(false)}
          >
            {snackbarMessage}
          </Alert>
        )}
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={deleteEmail}
          onChange={(e) => setDeleteEmail(e.target.value)}
          sx={{ mb: 2 }}
          aria-label="Enter your email"
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
          aria-label="Enter your password"
        />
        <Button
          onClick={handleOpenDialog}
          variant="contained"
          color="error"
          sx={{
            bgcolor: "#FF3D00",
            color: "#FFFFFF",
            fontWeight: "bold",
            "&:hover": { bgcolor: "#D32F2F" },
          }}
          disabled={!isFormValid || loading}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {loading ? "Deleting..." : "Delete Account"}
        </Button>
      </Card>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="delete-account-dialog-title"
      >
        <DialogTitle id="delete-account-dialog-title">
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            aria-label="Cancel account deletion"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteAccount();
              handleCloseDialog();
            }}
            color="error"
            autoFocus
            aria-label="Confirm account deletion"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {snackbarSeverity === "error" && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default DeleteAccount;
