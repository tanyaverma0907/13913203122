export function log(message, data) {
  try {
    const timestamp = new Date().toISOString();

    const fullMessage = `[${timestamp}] ${message}`;

    console.info(fullMessage, data || "");
  } catch (error) {
    console.warn("Logging failed:", error);
  }
}
