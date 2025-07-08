import React from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
  IconButton,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function ClickDetailsRow({ clicks }) {
  const [open, setOpen] = React.useState(false);

  if (!clicks || clicks.length === 0) return null;

  return (
    <>
      <Box display="flex" alignItems="center" mt={1}>
        <IconButton size="small" onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
        <Typography
          variant="subtitle2"
          sx={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          View {clicks.length} Click{clicks.length > 1 ? "s" : ""}
        </Typography>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box mt={2}>
          <Table size="small" sx={{ backgroundColor: "#f8f9fa" }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Timestamp</strong>
                </TableCell>
                <TableCell>
                  <strong>Source</strong>
                </TableCell>
                <TableCell>
                  <strong>Location</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clicks.map((click, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(click.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{click.source || "Unknown"}</TableCell>
                  <TableCell>{click.location || "Unknown"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </>
  );
}

export default function ShortenedList({ shortenedUrls }) {
  if (!shortenedUrls || shortenedUrls.length === 0) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          No shortened URLs found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        🔗 URL Shortener Statistics
      </Typography>

      <Stack spacing={4}>
        {shortenedUrls.map((item) => (
          <Paper
            key={item.shortcode}
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: "#ffffff",
              boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Short URL:{" "}
              <a
                href={`http://localhost:3000/${item.shortcode}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", fontWeight: 600 }}
              >
                http://localhost:3000/{item.shortcode}
              </a>
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Original URL:</strong>{" "}
              <a
                href={item.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#333", textDecoration: "underline" }}
              >
                {item.originalUrl}
              </a>
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              <strong>Created At:</strong>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Expires At:</strong>{" "}
              {new Date(item.expiresAt).toLocaleString()}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Total Clicks:</strong> {item.clickCount || 0}
            </Typography>

            <ClickDetailsRow clicks={item.clicks} />
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
