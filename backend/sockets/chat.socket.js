
import mongoose from "mongoose"; 
import Chat from "../models/Chat.js"; 
import Message from "../models/Message.js"; 
import { getOnlineUsers } from "./presence.socket.js"; 
 
const userRoom = (userId) => `user:${userId}`; 
 
// Mark pending messages as delivered 
export const markPendingMessagesDelivered = async (io, userId) => { 
  try { 
    const messages = await Message.find({ 
      receiverId: userId, 
      status: "sent", 
    }); 
 
    for (const message of messages) { 
      // Atomically claim "sent" messages so concurrent reconnects / multi-tab
      // sessions can't process the same pending message twice (race fix)
      const updatedMessage = await Message.findOneAndUpdate(
        { _id: message._id, status: "sent" },
        { status: "delivered" },
        { new: true }
      ); 

      // Another connection already delivered this message — skip it
      if (!updatedMessage) continue; 
  
      io.to(userRoom(message.senderId.toString())).emit("message_status", { 
        messageId: updatedMessage._id, 
        chatId: updatedMessage.chatId, 
        status: "delivered", 
        receiverId: userId, 
      }); 

      // Send the actual pending message to receiver
      const populatedMessage = await Message.findById(updatedMessage._id) 
        .populate("senderId", "name phone profileImage") 
        .populate("receiverId", "name phone profileImage") 
        .populate("replyTo"); 
  
      io.to(userRoom(userId)).emit("new_message", { 
        message: populatedMessage, 
      }); 
    } 
  } catch (error) { 
    console.error("Error marking pending messages as delivered:", error); 
  } 
}; 
 
export const setupChatSocket = (io, socket) => { 
  const senderId = socket.userId.toString(); 
 
  // Send message 
  socket.on("send_message", async (data, callback) => { 
    try { 
      const { 
        chatId, 
        content = "", 
        type = "text", 
        mediaUrl = "", 
        replyTo = null, 
        clientMessageId = null, 
      } = data; 
 
      if (!mongoose.Types.ObjectId.isValid(chatId)) { 
        return callback?.({ 
          success: false, 
          message: "Invalid chat ID", 
        }); 
      } 
 
      // Verify chat exists and user is participant 
      const chat = await Chat.findOne({ 
        _id: chatId, 
        participants: senderId, 
      }); 
 
      if (!chat) { 
        return callback?.({ 
          success: false, 
          message: "Chat not found", 
        }); 
      } 
 
      // Get receiver 
      const receiverId = chat.participants 
        .find((p) => p.toString() !== senderId) 
        .toString(); 
 
      // Create message 
      const message = await Message.create({ 
        chatId, 
        senderId, 
        receiverId, 
        type, 
        content, 
        mediaUrl, 
        replyTo, 
        status: "sent", 
      }); 
 
      // Update chat 
      chat.lastMessage = message._id; 
      chat.lastMessageAt = new Date(); 
      await chat.save(); 
 
      // Populate message 
      const populatedMessage = await Message.findById(message._id) 
        .populate("senderId", "name phone profileImage") 
        .populate("receiverId", "name phone profileImage") 
        .populate("replyTo"); 
 
      // Confirm to sender 
      socket.emit("message_sent", { 
        message: populatedMessage, 
        clientMessageId, 
      }); 
 
      // Check if receiver is online 
      const receiverOnline = getOnlineUsers().has(receiverId); 
 
      if (receiverOnline) { 
        // Mark as delivered 
        message.status = "delivered"; 
        await message.save(); 
 
        const deliveredMessage = await Message.findById(message._id) 
          .populate("senderId", "name phone profileImage") 
          .populate("receiverId", "name phone profileImage") 
          .populate("replyTo"); 
 
        // Send to receiver 
        io.to(userRoom(receiverId)).emit("new_message", { 
          message: deliveredMessage, 
        }); 
 
        // Update sender about delivered status 
        io.to(userRoom(senderId)).emit("message_status", { 
          messageId: message._id, 
          chatId, 
          status: "delivered", 
          receiverId, 
        }); 
      } 
 
      callback?.({ 
        success: true, 
        message: populatedMessage, 
      }); 
    } catch (error) { 
      console.error("Socket send message error:", error); 
      callback?.({ 
        success: false, 
        message: "Failed to send message", 
      }); 
    } 
  }); 
 
  // Typing start 
  socket.on("typing_start", ({ receiverId, chatId }) => { 
    if (!receiverId || !chatId) return; 
    io.to(userRoom(receiverId)).emit("typing_start", { 
      senderId, 
      chatId, 
    }); 
  }); 
 
  // Typing stop 
  socket.on("typing_stop", ({ receiverId, chatId }) => { 
    if (!receiverId || !chatId) return; 
    io.to(userRoom(receiverId)).emit("typing_stop", { 
      senderId, 
      chatId, 
    }); 
  }); 
 
  // Mark message as read 
  socket.on("message_read", async ({ messageId, chatId }, callback) => { 
    try { 
      if (!mongoose.Types.ObjectId.isValid(messageId)) { 
        return callback?.({ 
          success: false, 
          message: "Invalid message ID", 
        }); 
      } 
 
      const message = await Message.findOne({ 
        _id: messageId, 
        chatId, 
        receiverId: senderId, 
      }); 
 
      if (!message) { 
        return callback?.({ 
          success: false, 
          message: "Message not found", 
        }); 
      } 
 
      message.status = "read"; 
      await message.save(); 
 
      // Notify sender 
      io.to(userRoom(message.senderId.toString())).emit("message_status", { 
        messageId: message._id, 
        chatId, 
        status: "read", 
        readBy: senderId, 
      }); 
 
      callback?.({ 
        success: true, 
        message: "Message marked as read", 
      }); 
    } catch (error) { 
      console.error("Message read error:", error); 
      callback?.({ 
        success: false, 
        message: "Failed to mark message as read", 
      }); 
    } 
  }); 
};