import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import StatisticsList from "../components/StatisticsList";
import { getStatistics } from "../services/api";

export default function StatisticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStatistics()
      .then((stats) => {
        setData(stats);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load statistics.");
        setLoading(false);
      });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #e3f2fd, #bbdefb)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            mx: "auto", // horizontally center
            maxWidth: 800, // fixed width if needed
            textAlign: "center", // optional for centering text
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
