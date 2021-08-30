// user controller 
const ctrl = require('./contractMaster.controller');
// custom joi validation
const {
  joiContractGet,
  joiContractPost,
  joiContractGetDetails
} = require('./contractMaster.validators');

// import hooks 
const {
  isValidContract, // check whether the contract is valid or not 
  isValidContractor, // check whether the user is contractor or not 
} = require('../../../hooks');

// auth 
const {
  verifyUserToken
} = require('../../../hooks/Auth');

// exporting the user routes 
function contractMasterRoutes() {
  return (open, closed) => {

    // Sign Up a new User
    closed.route('/').post(
      [joiContractPost], // joi validation
      verifyUserToken, // verify token
      isValidContractor, // check whether the user is contractor or not 
      ctrl.post // controller function
    );

    // Get Contract list 
    closed.route('/').get(
      verifyUserToken, // verify token
      [joiContractGet], // joi validation
      ctrl.get // controller function
    );

    // Get Details 
    closed.route('/:contractId').get(
      verifyUserToken, // verify token
      [joiContractGetDetails], // joi validation
      isValidContract, // check whether the contract is valid or not 
      ctrl.getDetails // controller function
    );
  };
}

module.exports = contractMasterRoutes();
