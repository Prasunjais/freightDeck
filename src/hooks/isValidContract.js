// Controller
const contractCtrl = require('../components/contract/contractMaster/contractMaster.controller');

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
    let contractId = req.body.contractId || req.params.contractId; // get the contract id 

    // mongoose valid id 
    if (objectId.isValid(contractId)) {
      // check whether the email id is unique or not 
      let isValidContractId = await contractCtrl.isValid(contractId)

      // if email is unique
      if (isValidContractId.success) {
        info('Valid Contract Id')
        return next();
      } else {
        error('INVALID Contract Id!');
        return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.contracts.contractIdIsInvalidorDeleted);
      }
    } else {
      error('The Contract ID is Invalid !');
      return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.contracts.contractIdIsInvalid);
    }

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
