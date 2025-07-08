import { useState } from "react";
import { Container, Paper, Typography, Divider, Box } from "@mui/material";
import ShortenerForm from "../components/ShortenerForm";
import ShortenedList from "../components/ShortenedList";

export default function HomePage() {
  const [shortened, setShortened] = useState([]);

  const handleShortened = (newItem) => {
    setShortened([...shortened, newItem]);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(to bottom right, #e3f2fd, #bbdefb)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            mx: "auto",
            maxWidth: "100%",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            🔗 URL Shortener
          </Typography>

          <ShortenerForm onSubmit={handleShortened} />
          <Divider sx={{ my: 4 }} />
          <ShortenedList shortenedUrls={shortened} />
        </Paper>
      </Container>
    </Box>
  );
}
