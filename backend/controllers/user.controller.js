import User from "../models/User.js";
import { getOnlineUsers } from "../sockets/presence.socket.js";

// @desc    Get all users (except current user)
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Get all users except current user
    const users = await User.find({
      _id: { $ne: currentUserId }
    })
    .select("-password -refreshToken -__v")
    .sort({ name: 1 });

    // Add online status from socket map
    const onlineUsers = getOnlineUsers();
    
    const usersWithStatus = users.map(user => {
      const userObj = user.toObject();
      userObj.isOnline = onlineUsers.has(user._id.toString());
      return userObj;
    });

    res.json({
      success: true,
      count: usersWithStatus.length,
      data: usersWithStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("-password -refreshToken -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check online status
    const onlineUsers = getOnlineUsers();
    const userObj = user.toObject();
    userObj.isOnline = onlineUsers.has(id);

    res.json({
      success: true,
      data: userObj
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, about, profileImage, phone } = req.body;

    // Check if user exists
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is updating their own profile
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user"
      });
    }

    // Check if phone is already taken by another user
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({
        phone,
        _id: { $ne: id }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use"
        });
      }
    }

    // Update fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: name || user.name,
        about: about !== undefined ? about : user.about,
        profileImage: profileImage !== undefined ? profileImage : user.profileImage,
        phone: phone || user.phone
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password -refreshToken -__v");

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", ")
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search users by name, email, or phone
// @route   GET /api/users/search?q=searchTerm
// @access  Private
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user._id;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchRegex = new RegExp(q, "i");

    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ]
    })
    .select("-password -refreshToken -__v")
    .limit(20);

    const onlineUsers = getOnlineUsers();
    
    const usersWithStatus = users.map(user => {
      const userObj = user.toObject();
      userObj.isOnline = onlineUsers.has(user._id.toString());
      return userObj;
    });

    res.json({
      success: true,
      count: usersWithStatus.length,
      data: usersWithStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's online status
// @route   GET /api/users/:id/status
// @access  Private
export const getUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("isOnline lastSeen name profileImage");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const onlineUsers = getOnlineUsers();
    const isOnline = onlineUsers.has(id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        isOnline,
        lastSeen: user.lastSeen
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me/profile
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -refreshToken -__v");

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};