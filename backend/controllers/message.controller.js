import mongoose from "mongoose";
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// @desc    Get messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Check if chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or you're not a participant"
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get messages with pagination
    const messages = await Message.find({ chatId })
      .populate("senderId", "name profileImage isOnline")
      .populate("receiverId", "name profileImage isOnline")
      .populate({
        path: "replyTo",
        populate: [
          { path: "senderId", select: "name profileImage" },
          { path: "receiverId", select: "name profileImage" }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Message.countDocuments({ chatId });

    // Mark messages as read (for messages where current user is receiver)
    const unreadMessages = messages.filter(
      msg => 
        msg.receiverId._id.toString() === userId.toString() && 
        msg.status !== "read"
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: unreadMessages.map(m => m._id) },
          receiverId: userId
        },
        { status: "read" }
      );

      // Notify senders via socket (handled in socket layer)
      // This will be handled by socket events
    }

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid chat ID"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send a new message (HTTP version - fallback)
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content, type = "text", mediaUrl = "", replyTo } = req.body;
    const senderId = req.user._id;

    // Validate chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: senderId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or you're not a participant"
      });
    }

    // Get receiver
    const receiverId = chat.participants
      .find(p => p.toString() !== senderId.toString());

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "No receiver found in chat"
      });
    }

    // Create message
    const message = await Message.create({
      chatId,
      senderId,
      receiverId,
      type,
      content,
      mediaUrl,
      replyTo: replyTo || null,
      status: "sent"
    });

    // Update chat
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();
    await chat.save();

    // Populate message
    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "name profileImage isOnline")
      .populate("receiverId", "name profileImage isOnline")
      .populate({
        path: "replyTo",
        populate: [
          { path: "senderId", select: "name profileImage" },
          { path: "receiverId", select: "name profileImage" }
        ]
      });

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(", ")
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // Check if user is sender
    if (message.senderId.toString() !== userId.toString()) {
      // Check if user is receiver (can delete for themselves)
      if (message.receiverId.toString() === userId.toString()) {
        // Add to deletedFor array
        await Message.findByIdAndUpdate(id, {
          $addToSet: { deletedFor: userId }
        });
        
        return res.json({
          success: true,
          message: "Message deleted for you"
        });
      }
      
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this message"
      });
    }

    // Sender can delete for everyone
    await Message.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread/count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Message.countDocuments({
      receiverId: userId,
      status: { $ne: "read" }
    });

    res.json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { chatId, messageIds } = req.body;
    const userId = req.user._id;

    const query = {
      receiverId: userId,
      status: { $ne: "read" }
    };

    if (chatId) {
      query.chatId = chatId;
    }

    if (messageIds && Array.isArray(messageIds)) {
      query._id = { $in: messageIds };
    }

    const result = await Message.updateMany(query, {
      status: "read"
    });

    res.json({
      success: true,
      message: "Messages marked as read",
      data: {
        modifiedCount: result.modifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get message by ID
// @route   GET /api/messages/message/:id
// @access  Private
export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: id,
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    })
    .populate("senderId", "name profileImage isOnline")
    .populate("receiverId", "name profileImage isOnline")
    .populate({
      path: "replyTo",
      populate: [
        { path: "senderId", select: "name profileImage" },
        { path: "receiverId", select: "name profileImage" }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Forward message
// @route   POST /api/messages/:id/forward
// @access  Private
export const forwardMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { chatId } = req.body;
    const senderId = req.user._id;

    // Get original message
    const originalMessage = await Message.findById(id);

    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // Check if chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: senderId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or you're not a participant"
      });
    }

    // Get receiver
    const receiverId = chat.participants
      .find(p => p.toString() !== senderId.toString());

    // Create forwarded message
    const forwardedMessage = await Message.create({
      chatId,
      senderId,
      receiverId,
      type: originalMessage.type,
      content: originalMessage.content,
      mediaUrl: originalMessage.mediaUrl,
      status: "sent",
      // Store reference to original message
      replyTo: originalMessage._id
    });

    // Update chat
    chat.lastMessage = forwardedMessage._id;
    chat.lastMessageAt = new Date();
    await chat.save();

    const populatedMessage = await Message.findById(forwardedMessage._id)
      .populate("senderId", "name profileImage isOnline")
      .populate("receiverId", "name profileImage isOnline")
      .populate({
        path: "replyTo",
        populate: [
          { path: "senderId", select: "name profileImage" },
          { path: "receiverId", select: "name profileImage" }
        ]
      });

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};