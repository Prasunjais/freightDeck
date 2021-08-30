// user controller 
const ctrl = require('./contractTransporterBid.controller');
// custom joi validation
const {
  joiSignUpValidate,
  joiLogInValidate
} = require('./contractTransporterBid.validators');

// import hooks 
const {
  isEmailExist, // check whether email id exist or not 
  hashPassword, // encrypting the password 
  checkUserPassword, // check user password
  generateAdminToken, // generate admin token
  checkEmailIsUnique, // check whether the email is unique or not 
} = require('../../../hooks');

// exporting the user routes 
function userRoutes() {
  return (open, closed) => {

    // Sign Up a new User
    open.route('/sign-up').post(
      [joiSignUpValidate], // joi validation
      checkEmailIsUnique, // check whether the email is unique 
      hashPassword, // hash the coming passowr 
      ctrl.signUp // controller function
    );

    // login 
    open.route('/login').post(
      [joiLogInValidate], // joi validation
      isEmailExist, // check whether the email exist  
      checkUserPassword, // check whether the user password is correct or not
      generateAdminToken, // generate the admin token  
      ctrl.login // controller function
    );
  };
}

module.exports = userRoutes();
