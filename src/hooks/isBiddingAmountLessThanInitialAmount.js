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
    let bidInitialAmount = parseFloat(req.body.contractDetails.bidInitialAmount); // get the bid initial amount
    let biddingAmount = parseFloat(req.body.bidAmount);

    // check whether the bidding Amount is less than the bid initial amount
    if (biddingAmount > bidInitialAmount) {
      error('Bid Amount is greater than bid initial amount !');
      return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.contracts.contractBidAmountIsMoreThanTheInitialAmount(bidInitialAmount));
    } else return next()

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
