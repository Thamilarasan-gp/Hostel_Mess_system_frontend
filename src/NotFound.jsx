import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="md"
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h1" color="primary" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" sx={{ mt: 2 }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Box
        component="img"
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/media/509d62e7b346f72a0e52c59d5787f14b.gif"
        alt="404 Not Found"
        sx={{ width: "80%", maxWidth: 400, mt: 3 }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => navigate("/")}
      >
        Go to Homepage
      </Button>
    </Container>
  );
};

export default NotFound;
