import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI as string;

    if (!uri) {
      throw new Error("MONGO_URI not found in environment variables");
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // exit if DB connection fails
  }
};

export default connectDB;
