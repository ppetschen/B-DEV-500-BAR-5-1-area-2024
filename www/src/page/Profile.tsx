import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {getUser, updateUser} from "@/services/userManagement";
import {userNavigate} from "react-router-dom";

type UserData = {
  firstName: string,
  last_name: string;
  email: string;
  description: string;
};

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editBio, setEditBio] = useState("");

  const handleSaveProfile = () => {
    setUserData((prev) => ({
      ...prev,
      firstName: editFirstName,
      lastName: editLastName,
      bio: editBio,
    }));
    setIsEditing(false);
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Typography
      variant="h4"
      sx={{ fontWeight: "bold", color: "#5A6ACF", mb: 6 }}
      >
        PROFILE INFORMATION
      </Typography>
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
          alt={`${userData.firstName} ${userData.lastName}`}
          src={userData.avatar}
          sx={{ width: 90, height: 90, mr: 3, border: "1px solid #5A6ACF" }}
        />
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
                {`${userData.firstName} ${userData.lastName}`}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  setIsEditing(true);
                  setEditFirstName(userData.firstName);
                  setEditLastName(userData.lastName);
                  setEditBio(userData.bio);
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
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              sx={{ mb: 2 }}
            />
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
            >
              Save
            </Button>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            {userData.bio}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default ProfilePage;
