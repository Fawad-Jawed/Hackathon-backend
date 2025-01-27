const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
// const tokenRoutes = require('./routes/tokenRoutes');
const cors = require('cors');
const { authenticate, authorize } = require('./middleware/authMiddleware');
const { editBeneficiary, deleteBeneficiary } = require('./controllers/beneficiaryController');
const { getAllUsers, editUser, deleteUser } = require('./controllers/authController');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON requests

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);

// Protected Routes
app.put('/api/beneficiaries/editBeneficiary', authenticate, authorize(['Admin', 'Receptionist']), editBeneficiary);
app.delete('/api/beneficiaries/deleteBeneficiary', authenticate, authorize(['Admin']), deleteBeneficiary);
// app.use('/api/tokens', tokenRoutes);

app.get('/api/auth/getAllUsers', authenticate, authorize(['Admin']), getAllUsers);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
