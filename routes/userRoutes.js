const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Get all users (Admin only)
router.get('/', authenticate, authorize('Admin'), userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticate, userController.getUserById);

// Update user details (Admin only)
router.put('/:id', authenticate, authorize('Admin'), userController.updateUser);

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize('Admin'), userController.deleteUser);

module.exports = router;
