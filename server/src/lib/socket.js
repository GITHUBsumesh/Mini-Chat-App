import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  // io.emit("getOnlineUsers", Object.keys(userSocketMap));
  io.emit(
    "getOnlineUsers",
    Object.keys(userSocketMap).map((userId) => ({
      userId,
      socketId: userSocketMap[userId],
    }))
  );
  const onlineUsers = await User.find({
    _id: { $in: Object.keys(userSocketMap) },
  }).select("_id name profilePic");

  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", async () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    // io.emit("getOnlineUsers", Object.keys(userSocketMap));
    const updatedOnlineUsers = await User.find({
      _id: { $in: Object.keys(userSocketMap) },
    }).select("_id name profilePic");

    io.emit("getOnlineUsers", updatedOnlineUsers);
  });
});

export { io, app, server };
