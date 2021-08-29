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

    let email = req.body.email || req.params.email; // get the email id 

    // check whether the email id is unique or not 
    let isEmailExist = await userCtrl.isEmailExist(email)

    // if email is unique
    if (isEmailExist.success) {
      req.body = {
        ...req.body,
        userId: isEmailExist.data._id
      }
      return next();
    } else {
      error('Email Id doesn\'t exist !'); // route doesnt exist 
      return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.userAuthentication.emailIsNotValid);
    }

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
