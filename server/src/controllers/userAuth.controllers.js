import { asyncHandler } from '../utils/asyncHandler.utils.js';
import { ApiResponse } from '../utils/ApiResponse.utils.js';
import { ApiError } from '../utils/ApiError.utils.js';
import { User } from '../models/User.model.js';
import { options } from '../constant.js';

const generateAccessRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const register = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if ([username, email, fullname, password].some((field) => field === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new ApiError(400, 'User already exists with this username or email');
  }

  const user = await User.create({
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    fullname: fullname.trim(),
    password: password.trim(),
  });

  if (!user) {
    throw new ApiError(500, 'User registration failed');
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  const userData = await User.findById(user._id).select(
    '-password -refreshToken -verifyOtp -verifyOtpExpires -resetOtp -resetOtpExpires'
  );

  return res
    .status(201)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(201, 'User registered successfully', {
        user: userData,
        accessToken,
        refreshToken,
      })
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'Invalid email');
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid password');
  }

  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  const userData = await User.findById(user._id).select(
    '-password -refreshToken -verifyOtp -verifyOtpExpires -resetOtp -resetOtpExpires'
  );

  return res
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
      new ApiResponse(200, 'User logged in successfully', {
        user: userData,
        accessToken,
        refreshToken,
      })
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  return res
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, 'User logged out successfully'));
});

const generateVerifyOtp = asyncHandler(async (req, res) => {
  
});

const verifyOtp = asyncHandler(async (req, res) => {});

const generateResetOtp = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(async (req, res) => {});
