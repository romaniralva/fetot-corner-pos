import cors from "cors";

const allowedOrigins = ["http://localhost:3000"]; // frontend URL

export const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

export default cors(corsOptions);
