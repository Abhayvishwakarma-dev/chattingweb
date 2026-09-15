

import express from "express";
import passport from "passport";
import {
  register,
  login,
  googleCallback,
  refreshToken,
  logout,
  getCurrentUser,  // ✅ ADD THIS IMPORT
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Local auth
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);  // ✅ ADD THIS ROUTE

// ============================================
// GOOGLE AUTH ROUTES (Optional)
// ============================================

// Check if Google is configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && 
                          process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
                          process.env.GOOGLE_CLIENT_ID !== '';

if (isGoogleConfigured) {
  // Google auth routes
  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
    }),
    googleCallback
  );
  
  console.log('✅ Google auth routes enabled');
} else {
  console.log('⚠️  Google auth routes disabled - Add credentials to .env');
}

export default router;