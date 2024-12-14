import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";


const getUserData = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const user = await User.findById(userId).select("-password -refreshToken -verifyOtp -verifyOtpExpires -resetOtp -resetOtpExpires");

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  return res.status(200).json(new ApiResponse(200, "User data", user));
});

export { getUserData };