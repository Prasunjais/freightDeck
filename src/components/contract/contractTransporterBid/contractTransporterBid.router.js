// user controller 
const ctrl = require('./contractTransporterBid.controller');
// custom joi validation
const {
  joiContractBid,
} = require('./contractTransporterBid.validators');

// import hooks 
const {
  isValidContract, // is valid contract
  isValidTransporter, // check whether the transporter is valid or not
  isContractOpen, // check whether the contract is closed or open
  isBiddingAmountLessThanInitialAmount, // is bidding amount less the initial amount
} = require('../../../hooks');

// auth 
const {
  verifyUserToken
} = require('../../../hooks/Auth');

// exporting the user routes 
function userRoutes() {
  return (open, closed) => {

    // Sign Up a new User
    closed.route('/:contractId/bid').post(
      verifyUserToken, // auth verification
      [joiContractBid], // joi validation
      isValidContract, // check whether the contract id is valid or not
      isValidTransporter, // check whether the transporter is valid or not
      isContractOpen, // check whether the contract is closed or open
      isBiddingAmountLessThanInitialAmount, // Check Bidding Amount is Less than the initial amount 
      ctrl.placeBid // controller function
    );
  };
}

module.exports = userRoutes();
