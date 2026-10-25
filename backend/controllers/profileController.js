const User = require('../models/User');

/**
 * @route   GET /api/profile
 * @desc    Get authenticated buyer profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-cart');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
        errors: []
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      buyer: user,
      user: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/profile
 * @desc    Update allowed profile fields (name, phone, city, address)
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'phone', 'city', 'address'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = String(req.body[field]).trim();
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid profile update fields provided.',
        errors: []
      });
    }

    // Name validation
    if (updates.name && updates.name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters.',
        errors: [{ field: 'name', message: 'Name is too short' }]
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-cart');

    res.status(200).json({
      success: true,
      message: 'Buyer profile updated successfully.',
      data: updatedUser,
      buyer: updatedUser,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/profile/change-password
 * @desc    Change user password after verifying current password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
        errors: []
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
        errors: [{ field: 'newPassword', message: 'Minimum 8 characters required' }]
      });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match.',
        errors: [{ field: 'confirmNewPassword', message: 'Passwords must match' }]
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
        errors: [{ field: 'currentPassword', message: 'Incorrect current password' }]
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
