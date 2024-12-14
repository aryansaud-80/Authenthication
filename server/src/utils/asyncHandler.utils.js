const asyncHandler = (requestHandler) => {
  return (res, req, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

export { asyncHandler };
