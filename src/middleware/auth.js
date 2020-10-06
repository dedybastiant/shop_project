const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Request Authentication Failed");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (error) {
    error.message = "Request Authentication Failed";
    error.statusCode = 401;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("Request Authentication Failed");
    error.statusCode = 401;
    throw error;
  }
  req.userRole = decodedToken.role;
  req.userId = decodedToken.userId;
  next();
};
