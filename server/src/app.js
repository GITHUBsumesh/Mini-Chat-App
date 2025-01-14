import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

// using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  })
);
const PORT = process.env.PORT;
// using routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Working");
});

server.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
  connectDB();
});

// Using Middleware
app.use(errorMiddleware);
