import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// @desc    Get all chats for current user
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId
    })
    .populate("participants", "name profileImage isOnline")
    .populate({
      path: "lastMessage",
      populate: [
        { path: "senderId", select: "name profileImage" },
        { path: "receiverId", select: "name profileImage" }
      ]
    })
    .sort({ lastMessageAt: -1 })
    .lean();

    // Format chats with last message preview
    const formattedChats = chats.map(chat => {
      // Find other participant (for 1-1 chats)
      const otherParticipant = chat.participants.find(
        p => p._id.toString() !== userId.toString()
      );

      // Get unread count
      const unreadCount = 0; // Can be calculated with message status

      return {
        ...chat,
        otherParticipant: otherParticipant || null,
        unreadCount,
        lastMessagePreview: chat.lastMessage?.content || "",
        lastMessageTime: chat.lastMessage?.createdAt || chat.lastMessageAt
      };
    });

    res.json({
      success: true,
      count: formattedChats.length,
      data: formattedChats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get chat by ID
// @route   GET /api/chats/:id
// @access  Private
export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: id,
      participants: userId
    })
    .populate("participants", "name profileImage isOnline")
    .populate({
      path: "lastMessage",
      populate: [
        { path: "senderId", select: "name profileImage" },
        { path: "receiverId", select: "name profileImage" }
      ]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    // Get other participant
    const otherParticipant = chat.participants.find(
      p => p._id.toString() !== userId.toString()
    );

    res.json({
      success: true,
      data: {
        ...chat.toObject(),
        otherParticipant
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

// @desc    Create a new chat
// @route   POST /api/chats
// @access  Private
export const createChat = async (req, res) => {
  try {
    const { participantId, isGroupChat = false, groupName = "" } = req.body;
    const userId = req.user._id;

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found"
      });
    }

    // Check if chat already exists (for 1-1 chats)
    if (!isGroupChat) {
      const existingChat = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: [userId, participantId], $size: 2 }
      });

      if (existingChat) {
        return res.json({
          success: true,
          message: "Chat already exists",
          data: existingChat
        });
      }
    }

    // Create new chat
    const chat = await Chat.create({
      participants: [userId, participantId],
      isGroupChat,
      ...(isGroupChat && { 
        groupName: groupName || participant.name + "'s Group",
        groupAdmin: userId 
      })
    });

    const populatedChat = await Chat.findById(chat._id)
      .populate("participants", "name profileImage isOnline");

    res.status(201).json({
      success: true,
      data: populatedChat
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

// @desc    Get or create chat with user
// @route   POST /api/chats/get-or-create
// @access  Private
export const getOrCreateChat = async (req, res) => {
  try {
    const { userId: otherUserId } = req.body;
    const currentUserId = req.user._id;

    if (currentUserId.toString() === otherUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot create chat with yourself"
      });
    }

    // Check if user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [currentUserId, otherUserId], $size: 2 }
    })
    .populate("participants", "name profileImage isOnline")
    .populate({
      path: "lastMessage",
      populate: [
        { path: "senderId", select: "name profileImage" },
        { path: "receiverId", select: "name profileImage" }
      ]
    });

    // Create new chat if doesn't exist
    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, otherUserId],
        isGroupChat: false
      });

      chat = await Chat.findById(chat._id)
        .populate("participants", "name profileImage isOnline")
        .populate({
          path: "lastMessage",
          populate: [
            { path: "senderId", select: "name profileImage" },
            { path: "receiverId", select: "name profileImage" }
          ]
        });
    }

    res.json({
      success: true,
      data: chat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update chat (group name, add/remove participants)
// @route   PUT /api/chats/:id
// @access  Private
export const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName, addParticipants, removeParticipants } = req.body;
    const userId = req.user._id;

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    // Only group chats can be updated
    if (!chat.isGroupChat) {
      return res.status(400).json({
        success: false,
        message: "Cannot update 1-1 chat"
      });
    }

    // Check if user is admin
    if (chat.groupAdmin.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only group admin can update group"
      });
    }

    // Update group name
    if (groupName) {
      chat.groupName = groupName;
    }

    // Add participants
    if (addParticipants && Array.isArray(addParticipants)) {
      const validUsers = await User.find({
        _id: { $in: addParticipants }
      });
      
      const validIds = validUsers.map(u => u._id.toString());
      
      chat.participants = [
        ...new Set([
          ...chat.participants.map(p => p.toString()),
          ...validIds
        ])
      ];
    }

    // Remove participants
    if (removeParticipants && Array.isArray(removeParticipants)) {
      chat.participants = chat.participants.filter(
        p => !removeParticipants.includes(p.toString())
      );
    }

    await chat.save();

    const updatedChat = await Chat.findById(id)
      .populate("participants", "name profileImage isOnline");

    res.json({
      success: true,
      data: updatedChat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chats/:id
// @access  Private
export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: id,
      participants: userId
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chatId: id });

    // Delete the chat
    await Chat.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Chat deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};