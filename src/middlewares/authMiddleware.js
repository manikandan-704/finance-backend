const jwt = require("jsonwebtoken");

// Verify Token Middleware
exports.authenticateUser = (req, res, next) => {
  // Get token from the authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user payload (userId, role) to the request object
    req.user = decoded;
    next(); // Move to the next middleware
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};

// Role Authorization Middleware
// checks current user's role is included
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden: ${req.user ? req.user.role : "Unknown"}s are not allowed to perform this action.`,
      });
    }
    next();
  };
};
