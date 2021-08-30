/**
 * All your Hooks Comes here 
 */
module.exports = {
  checkEmailIsUnique: require('./checkEmailIsUnique'), // check whether the email is unique or not in request body
  hashPassword: require('./hashPassword'), // encrypting user password 
  isEmailExist: require('./isEmailExist'), // check whether the email exists or not 
  checkUserPassword: require('./checkUserPassword'), // check user password is correct or not 
  generateAdminToken: require('./generateAdminToken'), // generate admin token
  isValidContractor: require('./isValidContractor'), // check whether the user is a valid contractor or not 
  isValidContract: require('./isValidContract'), // check whether the contract is valid or not 
};