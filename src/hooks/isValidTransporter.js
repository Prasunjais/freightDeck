// Controller
const userCtrl = require('../components/onBoard/user/user.controller');

// Responses & others utils 
const Response = require('../responses/response');
const StatusCodes = require('../facades/response');
const MessageTypes = require('../responses/types');
const Exceptions = require('../exceptions/Handler');
const mongoose = require('mongoose');
const {
  error,
  info
} = require('../utils').logging;

// exporting the hooks 
module.exports = async (req, res, next) => {
  try {
    info('Check whether the user email id is unique or not!');
    let objectId = mongoose.Types.ObjectId; // object id
    let userId = req.user._id; // get the user id

    // mongoose valid id 
    if (objectId.isValid(userId)) {

      // check whether the email id is unique or not 
      let isValidTransporter = await userCtrl.getDetailsUsingId(userId, 'transporter')

      // if email is unique
      if (isValidTransporter.success) {
        info('Valid Transporter')
        // injecting the data into the request body
        req.body.transporterDetails = isValidTransporter.data;
        // move on
        return next();
      } else {
        error('INVALID Transporter!');
        return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.contracts.transporterProfileEitherDeletedOrDeactivated);
      }
    } else {
      error('The Transporter ID is Invalid !');
      return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.contracts.invalidTransporterId);
    }

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
