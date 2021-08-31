// Controller
const userCtrl = require('../components/onBoard/user/user.controller');

// Responses & others utils 
const Response = require('../responses/response');
const StatusCodes = require('../facades/response');
const MessageTypes = require('../responses/types');
const Exceptions = require('../exceptions/Handler');
const {
  error,
  info
} = require('../utils').logging;

// exporting the hooks 
module.exports = async (req, res, next) => {
  try {
    info('Check whether the user email id is unique or not!');

    let email = req.body.email, // get the email id 
      userType = req.body.userType, // get the user type
      empId = req.body.empId; // employee id 

    // check whether the email id is unique or not 
    let isEmailUnique = await userCtrl.isEmailUnique(email, userType);

    // if email is unique
    if (isEmailUnique.success) return next();
    else {
      error('Email Id is not unique !'); // route doesnt exist 
      Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.userAuthentication.emailIdNotUnique);
    }

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
