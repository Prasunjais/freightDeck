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
      let isValidContractor = await userCtrl.getDetailsUsingId(userId)

      // if email is unique
      if (isValidContractor.success) {
        info('Valid Contractor')
        // injecting the data into the request body
        req.body.contractorDetails = isValidContractor.data;
        // move on
        return next();
      } else {
        error('INVALID CONTRACTOR!');
        return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.contracts.contractorProfileEitherDeletedOrDeactivated);
      }
    } else {
      error('The Contractor ID is Invalid !');
      return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.contracts.invalidContractorId);
    }

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
