const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = new User({ name, email, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign({ id: user._id, role: user.role , email: user.email , name:user.name}, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};



// Edit User
// In your controller (e.g., controllers/userController.js)
// const User = require('../models/User');

exports.editUser = async (req, res) => {
    const { id } = req.params; // Get user ID from the URL
    const { name, email, role } = req.body; // Get updated details from the request body
  
    try {
      // Validate input data
      if (!name || !email || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Find the user by ID
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user details
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
  
      await user.save();
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  



// Delete User
// In your controller (e.g., controllers/userController.js)
// const User = require('../models/User');

exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Get user ID from the URL

    try {
        // Only Admin can delete a user
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }

        // Find and delete the user by ID
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'No user found for the provided ID.' });
        }

        res.status(200).json({
            message: 'User deleted successfully.',
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Get All Users (excluding Admins)
exports.getAllUsers = async (req, res) => {
    try {
        // Only Admin can access this route
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You do not have permission to perform this action' });
        }

        // Fetch all users except those with the 'Admin' role
        const users = await User.find({ role: { $ne: 'Admin' } });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({
            message: 'Users fetched successfully.',
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
