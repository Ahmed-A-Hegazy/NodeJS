const APIError = require("./../util/APIError");

const restrictTo = (role) => {
  try{
    return (req, res, next) => {
      if (role !== req.user.role) {
        throw new APIError("You are not authorized to access this resource", 403);
    }
    next();
  };
  }catch(err){
    throw new APIError(err.message,403)
  }
};

module.exports = restrictTo;
