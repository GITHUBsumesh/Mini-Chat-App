import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const c = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${c.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};
