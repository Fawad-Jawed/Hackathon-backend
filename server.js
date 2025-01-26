const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
// const tokenRoutes = require('./routes/tokenRoutes');
const cors = require('cors')
const { authenticate, authorize } = require('./middleware/authMiddleware')

const { editBeneficiary, deleteBeneficiary } = require('./controllers/beneficiaryController');
const { getAllUsers, editUser, deleteUser } = require('./controllers/authController');

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // Enable CORS for all routes


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);

app.put('/api/beneficiaries/editBeneficiary', authenticate, authorize(['Admin', 'Receptionist']), editBeneficiary);
// DELETE /deleteBeneficiary
app.delete('/api/beneficiaries/deleteBeneficiary', authenticate, authorize(['Admin']), deleteBeneficiary);
// app.use('/api/tokens', tokenRoutes);
// GET /getAllUsers
app.get('/api/auth/getAllUsers', authenticate, authorize(['Admin']), getAllUsers);
// PUT /editUser

// DELETE /deleteUser


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
