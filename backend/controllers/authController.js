const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'supermart_sas_jwt_secure_secret_key_2026_se_lab_project';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new buyer account
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, city, address } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
        errors: [{ field: 'email', message: 'Email is already registered' }]
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      city: city ? city.trim() : undefined,
      address: address ? address.trim() : undefined,
      role: 'buyer'
    });

    const token = generateToken(user._id);

    const buyerPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      address: user.address,
      role: user.role
    };

    res.status(201).json({
      success: true,
      message: 'Buyer registration successful! Welcome to SuperMart SAS.',
      token,
      user: buyerPayload,
      buyer: buyerPayload
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate buyer & get token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
        errors: []
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
        errors: []
      });
    }

    const token = generateToken(user._id);

    const buyerPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      address: user.address,
      role: user.role
    };

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: buyerPayload,
      buyer: buyerPayload
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in buyer details
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
        errors: []
      });
    }

    const buyerPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      address: user.address,
      role: user.role
    };

    res.status(200).json({
      success: true,
      user: buyerPayload,
      buyer: buyerPayload
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout buyer
 * @access  Public / Private
 */
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
