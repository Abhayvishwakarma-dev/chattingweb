
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

// ============================================
// 📝 REGISTER
// ============================================

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user exists
    const searchCriteria = [];
    if (email && email.trim() !== "") {
      searchCriteria.push({ email: email.toLowerCase().trim() });
    }
    if (phone && phone.trim() !== "") {
      searchCriteria.push({ phone: phone.trim() });
    }

    if (searchCriteria.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required",
      });
    }

    let user = await User.findOne({ $or: searchCriteria });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      name: name.trim(),
      password: hashedPassword,
      authProvider: "local",
      isVerified: true,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`,
    };

    if (email && email.trim() !== "") {
      userData.email = email.toLowerCase().trim();
    }
    if (phone && phone.trim() !== "") {
      userData.phone = phone.trim();
    }

    user = await User.create(userData);

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // Set cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email || null,
        phone: user.phone || null,
        profileImage: user.profileImage,
        about: user.about,
        isOnline: user.isOnline,
        authProvider: user.authProvider,
        accessToken,
      },
    });

  } catch (error) {
    console.error("Register error:", error);
    
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

// ============================================
// 🔑 LOGIN
// ============================================

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and password are required",
      });
    }

    const trimmedIdentifier = identifier.trim();
    
    const user = await User.findOne({
      $or: [
        { email: trimmedIdentifier.toLowerCase() },
        { phone: trimmedIdentifier }
      ]
    }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "This account was registered with Google. Please login with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email || null,
        phone: user.phone || null,
        profileImage: user.profileImage,
        about: user.about,
        isOnline: user.isOnline,
        authProvider: user.authProvider,
        accessToken,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// ============================================
// 🔄 REFRESH TOKEN
// ============================================

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
    });
  }
};

// ============================================
// 🚪 LOGOUT
// ============================================

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// ============================================
// 👤 GET CURRENT USER ✅ ADD THIS
// ============================================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -refreshToken -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });
  }
};

// ============================================
// 🔐 GOOGLE CALLBACK
// ============================================

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=google_auth_failed`
      );
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${process.env.CLIENT_URL}/google-success?token=${accessToken}`
    );

  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(
      `${process.env.CLIENT_URL}/login?error=google_auth_failed`
    );
  }
};