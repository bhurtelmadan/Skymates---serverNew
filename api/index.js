// api/index.js

export default function handler(req, res) {
  try {
    res
      .status(200)
      .json({ message: "Welcome to the server! MAIN ENTRY POINT.. updated4" });
  } catch (error) {
    console.error("Error in API route:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
