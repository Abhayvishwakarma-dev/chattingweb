import { verifyAccessToken } from "./jwt.js";

const socketAuth = (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    // Handle Bearer token
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return next(new Error("Invalid or expired token"));
    }

    socket.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
};

export default socketAuth;