const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeaders = req.get("Authorization");
  if (!authHeaders) {
    req.isAuth = false;
    return next();
  }
  const token = authHeaders;
  try {
    decodeToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodeToken) {
    req.isAuth = false;
    return next();
  }
  req.userRole = decodeToken.role;
  req.userId = decodeToken.userId;
  req.isAuth = true;
  next();
};
