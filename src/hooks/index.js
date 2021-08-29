/**
 * All your Hooks Comes here 
 */
module.exports = {
  checkEmailIsUnique: require('./checkEmailIsUnique'), // check whether the email is unique or not in request body
  hashPassword: require('./hashPassword'), // encrypting user password 
  isEmailExist: require('./isEmailExist'), // check whether the email exists or not 
  checkUserPassword: require('./checkUserPassword'), // check user password is correct or not 
  generateAdminToken: require('./generateAdminToken'), // generate admin token
};