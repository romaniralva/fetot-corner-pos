import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import corsMiddleware from "./middleware/cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

// Routes
app.use("/api/auth", authRoutes);

// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
