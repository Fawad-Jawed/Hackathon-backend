const express = require('express');
const { registerUser, loginUser, editUser, deleteUser } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/editUser/:id', authenticate, authorize(['Admin']), editUser);
router.delete('/deleteUser/:id', authenticate, authorize(['Admin']), deleteUser);


module.exports = router;
