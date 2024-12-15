import { asyncHandler } from '../utils/asyncHandler.utils.js';
import { ApiResponse } from '../utils/ApiResponse.utils.js';
import { ApiError } from '../utils/ApiError.utils.js';
import { User } from '../models/user.models.js';
import { options } from '../constant.js';
import transporter from '../utils/nodeMailer.utils.js';
import generateOtp from '../utils/generateOtp.utils.js';
import {
  EMAIL_VERIFY_TEMPLATE,
  LOGIN_TO_AUTH_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_TO_AUTH_TEMPLATE,
} from '../utils/emailTemplates.utils.js';

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
  if (!req.body) {
    throw new ApiError(400, 'Request body is empty');
  }
  const { username, email, fullname, password } = req.body;

  if ([username, email, fullname, password].some((field) => field === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new ApiError(400, 'User already exists with this username or email');
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    fullname,
    password,
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

  const mailOptions = {
    from: process.env.EMAIL,
    to: userData.email,
    subject: 'Welcome to Auth',
    html: WELCOME_TO_AUTH_TEMPLATE.replace('{{fullname}}', userData.fullname),
  };

  await transporter.sendMail(mailOptions);

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
  if (!req.body) {
    throw new ApiError(400, 'Request body is empty');
  }
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

  const mailOptions = {
    from: process.env.EMAIL,
    to: userData.email,
    subject: 'Login Alert',
    html: LOGIN_TO_AUTH_TEMPLATE.replace('{{fullname}}', userData.fullname),
  };

  await transporter.sendMail(mailOptions);

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
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const otp = generateOtp();
  const otpExpires = Date.now() + 2 * 60 * 1000;

  user.verifyOtp = otp;
  user.verifyOtpExpires = otpExpires;

  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Verify OTP',
    html: EMAIL_VERIFY_TEMPLATE.replace('{{email}}', user.email).replace(
      '{{otp}}',
      otp
    ),
  };

  await transporter.sendMail(mailOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, 'OTP generated successfully', {}));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (otp !== user.verifyOtp) {
    throw new ApiError(400, 'Invalid OTP');
  }

  if (Date.now() > user.verifyOtpExpires) {
    throw new ApiError(400, 'OTP expired');
  }

  user.verifyOtp = '';
  user.verifyOtpExpires = 0;
  user.isVerified = true;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, 'OTP verified successfully'));
});

const generateResetOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const otp = generateOtp();
  const otpExpires = Date.now() + 2 * 60 * 1000;

  user.resetOtp = otp;
  user.resetOtpExpires = otpExpires;

  await user.save({ validateBeforeSave: false });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Reset OTP',
    html: PASSWORD_RESET_TEMPLATE.replace('{{email}}', user.email).replace(
      '{{otp}}',
      otp
    ),
  };

  await transporter.sendMail(mailOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, 'OTP generated successfully'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const {email, otp, newPassword } = req.body;

  if (!otp || !newPassword || !email) {
    throw new ApiError(400, 'OTP,password and email are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (otp !== user.resetOtp) {
    throw new ApiError(400, 'Invalid OTP');
  }

  if (Date.now() > user.resetOtpExpires) {
    throw new ApiError(400, 'OTP expired');
  }

  user.password = newPassword;
  user.resetOtp = '';
  user.resetOtpExpires = 0;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, 'Password reset successfully'));
});

const isUserAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    return res.status(200).json(new ApiResponse(200, 'User authenticated'));
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});

export {
  register,
  login,
  logout,
  generateVerifyOtp,
  verifyEmail,
  generateResetOtp,
  resetPassword,
  isUserAuthenticated,
};
