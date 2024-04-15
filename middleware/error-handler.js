const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  const customError = {
    msg: err.message || "Something went wrong, please try again",
    statusCode: err.statusCode || 500,
  };

  // handle duplicate error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} filed, please choose another value`;
    customError.statusCode = 400;
  }

  // handle validation error
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = 400;
  }

  // handle cast error
  if (err.name === "CastError") {
    customError.msg = `Invalid job id / job details`;
    customError.statusCode = 400;
  }

  return res.status(customError.statusCode).json(customError.msg);
};

module.exports = errorHandlerMiddleware;
