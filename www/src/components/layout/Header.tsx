import React, { useState } from "react";
import {
  TextField,
  Avatar,
  IconButton,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleCloseMenu();
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 2,
        backgroundColor: "#ffffff",
        boxShadow: 1,
        borderBottom: "1px solid #E0E0E0",
      }}
    >
      <TextField
        placeholder="Search..."
        variant="outlined"
        size="small"
        sx={{ width: "300px", backgroundColor: "#F7F9FC", borderRadius: 1 }}
      />
      <div>
        <IconButton onClick={handleOpenMenu}>
          <Avatar sx={{ bgcolor: "#5A6ACF" }} />
        </IconButton>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
        >
            <MenuItem>
                <AccountCircleIcon sx={{mr: 1}}/>
                Profile Info
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ExitToAppIcon sx={{mr: 1}}/>
                Logout
            </MenuItem>
        </Menu>
      </div>
    </Box>
  );
};

export default Header;
