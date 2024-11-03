import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MenuPage: React.FC = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #9333ea, #643DF2)",
        overflow: "hidden",
        padding: "0 20px",
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            sx={{ mb: 4, color: "#F2F2F2", fontWeight: "bold" }}
          >
            WELCOME TO AREA
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, color: "#F2F2F2", fontWeight: "bold" }}
          >
            Your all-in-one automation solution
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              fontSize: "1.2rem",
              padding: "12px 30px",
              borderRadius: "30px",
              transition: "border-color 0.3s, color 0.3s",
              margin: "0 10px",
              "&:hover": {
                borderColor: "#F9F9F8",
                color: "#F9F9F8",
              },
            }}
            onClick={() => (window.location.href = "/login")}
          >
            Log in
          </Button>
          <Button
            variant="contained"
            sx={{
              color: "#643DF2",
              bgcolor: "#F2F2F2",
              "&:hover": {
                bgcolor: "#7552F2",
                color: "white",
              },
              fontSize: "1.2rem",
              padding: "12px 30px",
              borderRadius: "30px",
              transition: "background-color 0.3s",
              margin: "0 10px",
            }}
            onClick={() => (window.location.href = "/signup")}
          >
            Get started for free
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default MenuPage;
