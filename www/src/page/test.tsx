import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  IconButton,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { getUser, updateUser } from "@/services/userManagement";
import { useNavigate } from "react-router-dom";

type UserData = {
  first_name: string;
  last_name: string;
  email: string;
  description: string;
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    first_name: "",
    last_name: "",
    email: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const user = await getUser();

      setIsLoading(false);

      if (user && typeof user !== "boolean") {
        setUserData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          description: user.description,
        });
      } else {
        setErrorMessage("Failed to load user data. Please log in again.");
        // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!editFirstName || !editLastName) {
      setErrorMessage("First Name and Last Name are required.");
      return;
    }

    setIsSaving(true);

    const updatedUser = await updateUser({
      first_name: editFirstName,
      last_name: editLastName,
      description: editDescription,
    });

    setIsSaving(false);

    if (updatedUser && typeof updatedUser !== "boolean") {
      setUserData({
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        description: updatedUser.description,
      });
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully.");
    } else {
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        <>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#5A6ACF", mb: 6 }}
          >
            PROFILE INFORMATION
          </Typography>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 4,
              p: 2,
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Avatar
              sx={{
                width: 90,
                height: 90,
                mr: 3,
                border: "1px solid #5A6ACF",
                bgcolor: "#5A6ACF",
                color: "#FFFFFF",
                fontSize: "36px",
              }}
            >
              {getInitials(userData.first_name, userData.last_name)}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              {isEditing ? (
                <>
                  <TextField
                    margin="dense"
                    label="First Name"
                    fullWidth
                    variant="outlined"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    margin="dense"
                    label="Last Name"
                    fullWidth
                    variant="outlined"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                </>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#333", mr: 1 }}
                  >
                    {`${userData.first_name} ${userData.last_name}`}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setIsEditing(true);
                      setEditFirstName(userData.first_name);
                      setEditLastName(userData.last_name);
                      setEditDescription(userData.description);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                </Box>
              )}
              <Typography variant="body2" color="textSecondary">
                {userData.email}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 4 }} />

          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              mb: 4,
              backgroundColor: "#FFFFFF",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
            >
              Bio
            </Typography>
            {isEditing ? (
              <>
                <TextField
                  margin="dense"
                  label="Bio"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    onClick={handleSaveProfile}
                    variant="contained"
                    sx={{
                      bgcolor: "#5A6ACF",
                      color: "#FFFFFF",
                      "&:hover": {
                        bgcolor: "#EDEEF1",
                        color: "#5A6ACF",
                      },
                    }}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outlined"
                    sx={{
                      color: "#5A6ACF",
                      borderColor: "#5A6ACF",
                      "&:hover": {
                        bgcolor: "#EDEEF1",
                      },
                    }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {userData.description || "No bio available."}
              </Typography>
            )}
          </Card>
        </>
      )}
    </Box>
  );
};

export default ProfilePage;