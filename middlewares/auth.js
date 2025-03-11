const jwt = require("jsonwebtoken");
const util = require("util");
const APIError = require("./../util/APIError");
const User = require("./../models/users");

const jwtVerify = util.promisify(jwt.verify);

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if(!token){
    throw new APIError('Unauthorized',401)
  }

  try{
    const { id } = await jwtVerify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).select("name email role");
    req.user = user;
    next()
  }catch(err){
    throw new APIError(err.message,401)
  }

};

module.exports = auth;
