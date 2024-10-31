import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  Stack,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "JohnDoe@gmail.com",
    avatar: "/static/images/avatar/1.jpg",
    bio: "Software Engineer with a passion for building web applications. Loves coding and learning new technologies. Always excited to tackle new challenges and explore innovative solutions in the tech world.",
    subscribedServices: [
      "Google Analytics",
      "Slack",
      "GitHub",
      "Facebook Ads",
      "Zoom",
      "Dropbox",
    ],
  });

  // State for password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  // Deletion states
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editBio, setEditBio] = useState("");

  const handlePasswordSave = () => {
    console.log("Password changed:", { currentPassword, newPassword });
  };

  const handleDeleteAccount = () => {
    console.log("Account deleted:", { deleteEmail, deletePassword });
  };

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
      {/* Profile Header */}
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
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", mr: 1 }}>
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

      {/* Bio Section */}
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          mb: 4,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
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

      {/* Services Subscribed To Section */}
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
          Services Subscribed To
        </Typography>
        <Stack spacing={1}>
          {userData.subscribedServices.map((service, index) => (
            <Typography key={index} variant="body2" color="textSecondary">
              • {service}
            </Typography>
          ))}
        </Stack>
      </Card>

      {/* Change Password Section */}
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
          Change Password
        </Typography>
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
            bgcolor: "#5A6ACF",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "#EDEEF1",
              color: "#5A6ACF",
            },
          }}
        >
          Save Password
        </Button>
      </Card>

      {/* Delete Account Section */}
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
          Delete Account
        </Typography>
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

export default ProfilePage;