import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const MAX_ENTRIES = 5;

const defaultEntry = { originalUrl: "", validity: "", customCode: "" };

export default function ShortenerForm({ onSubmit }) {
  const [entries, setEntries] = useState([{ ...defaultEntry }]);
  const [errors, setErrors] = useState([]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateShortcode = (code) => {
    if (!code) return true;
    return /^[a-zA-Z0-9]{1,10}$/.test(code);
  };

  const validateValidity = (val) => {
    if (!val) return true;
    return /^\d+$/.test(val) && Number(val) > 0;
  };

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);

    const newErrors = [...errors];
    if (newErrors[index]) {
      newErrors[index][field] = false;
      setErrors(newErrors);
    }
  };

  const handleAddEntry = () => {
    if (entries.length < MAX_ENTRIES) {
      setEntries([...entries, { ...defaultEntry }]);
      setErrors([...errors, {}]);
    }
  };

  const handleRemoveEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    const newErrors = errors.filter((_, i) => i !== index);
    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = [];
    let hasError = false;

    entries.forEach(({ originalUrl, validity, customCode }, idx) => {
      const entryErrors = {
        originalUrl: false,
        validity: false,
        customCode: false,
      };

      if (!originalUrl || !validateUrl(originalUrl)) {
        entryErrors.originalUrl = true;
        hasError = true;
      }
      if (!validateValidity(validity)) {
        entryErrors.validity = true;
        hasError = true;
      }
      if (!validateShortcode(customCode)) {
        entryErrors.customCode = true;
        hasError = true;
      }

      newErrors[idx] = entryErrors;
    });

    setErrors(newErrors);

    if (!hasError) {
      const preparedData = entries.map(
        ({ originalUrl, validity, customCode }) => ({
          originalUrl,
          validity: validity ? Number(validity) : 30,
          customCode: customCode.trim() || null,
        })
      );

      onSubmit(preparedData);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold" }}
      >
        URL Shortener
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        {entries.map(({ originalUrl, validity, customCode }, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{ p: 3, mb: 3, position: "relative", borderRadius: 3 }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Original URL"
                  variant="outlined"
                  fullWidth
                  required
                  value={originalUrl}
                  error={errors[index]?.originalUrl || false}
                  helperText={
                    errors[index]?.originalUrl
                      ? "Please enter a valid URL."
                      : "Example: https://example.com"
                  }
                  onChange={(e) =>
                    handleChange(index, "originalUrl", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="Validity (minutes)"
                  variant="outlined"
                  fullWidth
                  value={validity}
                  error={errors[index]?.validity || false}
                  helperText={
                    errors[index]?.validity
                      ? "Enter a positive integer or leave empty for 30 mins."
                      : "Optional (default 30)"
                  }
                  onChange={(e) =>
                    handleChange(index, "validity", e.target.value)
                  }
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="Custom Shortcode"
                  variant="outlined"
                  fullWidth
                  value={customCode}
                  error={errors[index]?.customCode || false}
                  helperText={
                    errors[index]?.customCode
                      ? "Alphanumeric, max 10 chars."
                      : "Optional"
                  }
                  onChange={(e) =>
                    handleChange(index, "customCode", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={1}>
                {entries.length > 1 && (
                  <Tooltip title="Remove">
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveEntry(index)}
                      aria-label="remove url"
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            disabled={entries.length >= MAX_ENTRIES}
            onClick={handleAddEntry}
          >
            Add URL
          </Button>

          <Button variant="contained" type="submit" size="large">
            Shorten URLs
          </Button>
        </Box>
      </form>
    </Container>
  );
}
