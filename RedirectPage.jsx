import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const getUrlMapping = (code) => {
  const stored = JSON.parse(localStorage.getItem("urlMappings") || "{}");
  return stored[code] || null;
};

const trackClick = (code) => {
  const clicksKey = "clickData";
  const clickData = JSON.parse(localStorage.getItem(clicksKey) || "{}");
  const now = new Date().toISOString();

  if (!clickData[code]) clickData[code] = [];

  const source = document.referrer || "Direct";
  const geo = "Unknown";

  clickData[code].push({ timestamp: now, source, geo });
  localStorage.setItem(clicksKey, JSON.stringify(clickData));
};

export default function RedirectPage() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const mapping = getUrlMapping(shortCode);
    if (mapping) {
      trackClick(shortCode);
      if (new Date(mapping.expiry) < new Date()) {
        setError("This short URL has expired.");
        return;
      }
      setTimeout(() => {
        window.location.href = mapping.url;
      }, 500);
    } else {
      setError("Short URL not found.");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [shortCode, navigate]);

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#ffebee",
          p: 4,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" color="error" mb={2}>
          {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Redirecting to home...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#e3f2fd",
        p: 4,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Redirecting to original URL...
      </Typography>
    </Box>
  );
}
