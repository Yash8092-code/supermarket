const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.patch('/', updateProfile);
router.post('/change-password', changePassword);

module.exports = router;
