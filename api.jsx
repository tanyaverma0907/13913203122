function generateCode(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getStoredMappings() {
  return JSON.parse(localStorage.getItem("urlMappings") || "{}");
}

function saveMappings(mappings) {
  localStorage.setItem("urlMappings", JSON.stringify(mappings));
}

function getClickData() {
  return JSON.parse(localStorage.getItem("clickData") || "{}");
}

function saveClickData(data) {
  localStorage.setItem("clickData", JSON.stringify(data));
}

function isValidShortCode(code) {
  return /^[a-zA-Z0-9]{3,10}$/.test(code);
}

/**
 * Shorten a URL
 * @param {string} url Original long URL
 * @param {number} validityMinutes Optional validity in minutes (default 30)
 * @param {string} customCode Optional custom shortcode
 * @returns {Promise} Resolves with created shortened URL info or rejects with error message
 */
export function shortenURL(url, validityMinutes = 30, customCode) {
  return new Promise((resolve, reject) => {
    if (!url) return reject("URL is required");
    try {
      new URL(url);
    } catch {
      return reject("Invalid URL format");
    }

    if (validityMinutes <= 0 || !Number.isInteger(validityMinutes)) {
      return reject("Validity period must be a positive integer");
    }

    const mappings = getStoredMappings();

    let shortCode = customCode;

    if (customCode) {
      if (!isValidShortCode(customCode)) {
        return reject(
          "Custom shortcode must be alphanumeric and 3-10 characters long"
        );
      }
      if (mappings[customCode]) {
        return reject("Custom shortcode already in use");
      }
    } else {
      do {
        shortCode = generateCode();
      } while (mappings[shortCode]);
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + validityMinutes * 60000);

    mappings[shortCode] = {
      url,
      createdAt: now.toISOString(),
      expiry: expiry.toISOString(),
    };

    saveMappings(mappings);

    resolve({
      url,
      shortCode,
      createdAt: now.toISOString(),
      expiry: expiry.toISOString(),
    });
  });
}

/**
 * Get all statistics, including clicks for each shortened URL
 * @returns {Promise} Resolves with an array of objects: {url, shortCode, createdAt, expiry, clicks}
 */
export function getStatistics() {
  return new Promise((resolve) => {
    const mappings = getStoredMappings();
    const clicks = getClickData();

    const result = Object.entries(mappings).map(([shortCode, data]) => ({
      shortCode,
      url: data.url,
      createdAt: data.createdAt,
      expiry: data.expiry,
      clicks: clicks[shortCode] || [],
    }));

    resolve(result);
  });
}

/**
 * Track a click on a shortCode
 * @param {string} shortCode
 */
export function trackClick(shortCode) {
  const clicks = getClickData();
  if (!clicks[shortCode]) clicks[shortCode] = [];

  const now = new Date().toISOString();
  const source = document.referrer || "Direct";
  const geo = "Unknown";

  clicks[shortCode].push({ timestamp: now, source, geo });

  saveClickData(clicks);
}
