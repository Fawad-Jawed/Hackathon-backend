const express = require('express');
const { addBeneficiary, getBeneficiary, deleteBeneficiary, editBeneficiary } = require('../controllers/beneficiaryController');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware')

router.post('/add', addBeneficiary);
router.post('/get-user', getBeneficiary);
router.get('/get', getBeneficiary);
// PUT /editBeneficiary


module.exports = router;
