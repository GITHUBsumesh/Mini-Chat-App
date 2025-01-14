import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import ErrorHandler from "../middleware/error.middleware.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    if (!messages) return next(new ErrorHandler("Messages not found", 404));

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (err) {
    next(err);
  }
};
export const sendMessage = async (req, res, next) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      status: "sending",
    });

 // Emit the message to the recipient if they are online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        ...newMessage.toObject(),
        status: "delivered",
      });

      // Update the message status to "delivered"
      newMessage.status = "delivered";
      await newMessage.save();
    } else {
      newMessage.status = "sent";
      await newMessage.save();
    }
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (err) {
    next(err);
  }
};
// export const markMessageAsSeen = async (req, res, next) => {
//   try {
//     const { messageId } = req.params;
//     const userId = req.user._id;

//     // Find the message and ensure the logged-in user is the receiver
//     const message = await Message.findOne({
//       _id: messageId,
//       receiverId: userId,
//     });

//     if (!message) return next(new ErrorHandler("Message not found", 404));

//     // Update the message status to "seen"
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("messageSeen", {
//         messageId: message._id,
//         status: "seen",
//       });
//     }
//     message.status = "seen";
//     await message.save();

//     res.status(200).json({
//       success: true,
//       message: "Message marked as seen",
//       updatedMessage: message,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// export const markMessagesAsSeen = async (req, res, next) => {
//   try {
//     const { id: userToChatId } = req.params; // User ID of the chat partner
    
//     const { messageIds } = req.body; // Array of message IDs to mark as seen
//     // console.log(messageIds);
//     const myId = req.user._id;

//     // if (!messageIds || !Array.isArray(messageIds)) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "Invalid message IDs provided",
//     //   });
//     // }
//     // Ensure messageIds is an array
//     if (!Array.isArray(messageIds)) {
//       messageIds = [messageIds]; // Convert single ID to an array if it's not an array
//     }

//     console.log("Received messageIds:", messageIds); // Log the messageIds

//     if (!messageIds.length) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid message IDs provided",
//       });
//     }


//     // Update the status of the specified messages to "seen"
//     const result = await Message.updateMany(
//       {
//         _id: { $in: messageIds },
//         senderId: userToChatId,
//         receiverId: myId,
//         status: { $ne: "seen" }, // Only update if not already seen
//       },
//       { $set: { status: "seen" } }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Messages marked as seen",
//       updatedCount: result.nModified, // Number of messages updated
//     });

//     // Optionally, emit a WebSocket event to notify the sender
//     const senderSocketId = getReceiverSocketId(userToChatId);
//     if (senderSocketId) {
//       io.to(senderSocketId).emit("messagesSeen", {
//         userId: myId, // Notify sender about the user who saw the messages
//         messageIds,
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// };

export const markMessageAsSeen = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const { messageIds } = req.body; // Assuming messageIds is passed in the request body
    const messages = await Message.find({
      _id: { $in: messageIds },
      receiverId: userId, // Ensure only the receiver's messages are marked as seen
    });

    if (!messages || messages.length === 0) {
      return next(new ErrorHandler("Messages not found", 404));
    }

    // Update the status of each message
    const updatedMessages = await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { status: 'seen' } }
    );

    messages.forEach((message) => {
      const senderSocketId = getReceiverSocketId(message.senderId);  // Get the sender's socket ID
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageStatusUpdated", { messageId: message._id, status: 'seen' });
      }
    });
    
    res.status(200).json({
      success: true,
      message: "Messages marked as seen",
      updatedMessages,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      filteredUsers,
    });
  } catch (err) {
    next(err);
  }
};
