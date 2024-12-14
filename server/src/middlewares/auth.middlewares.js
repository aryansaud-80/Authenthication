import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.utils.js';
import { ApiError } from '../utils/ApiError.utils.js';
import { User } from '../models/user.models.js';

const jwtVerifyToken = asyncHandler(async (req, res, next) => {
  const incomingAccessToken =
    req.cookies.accessToken ||
    req.headers['Authorization'].replace('Bearer ', '');

  if (!incomingAccessToken) {
    throw new ApiError(401, 'Unauthorized');
  }

  const decodedToken = jwt.verify(
    incomingAccessToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  req.user = user;

  next();
});

export { jwtVerifyToken };
