const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication Middleware
exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token data (e.g., user ID, role) to req.user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid', error });
  }
};

// Role-Based Authorization Middleware
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Only users with the following roles are allowed: ${roles.join(', ')}` 
      });
    }
    next();
  };
};
