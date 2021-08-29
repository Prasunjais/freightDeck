// controller
const userMasterCtrl = require('../components/onBoard/user/user.controller');
const BasicCtrl = require('../components/basic_config/basic_config.controller');

// Responses & others utils 
const Response = require('../responses/response');
const StatusCodes = require('../facades/response');
const MessageTypes = require('../responses/types');
const Exceptions = require('../exceptions/Handler');
const secret = process.env.secret;
const jwt = require('jsonwebtoken');
const {
  error,
  info
} = require('../utils').logging;

// exporting the hooks 
module.exports = async (req, res, next) => {
  try {
    info('Generate TOKEN!');
    // getting the token expiry time 
    const expiryTime = await BasicCtrl.GET_TOKEN_EXPIRY_TIME_IN_MIN().then((res) => { if (res.success) return res.data; else return 50; });
    let emailId = req.body.email; // get the email id 
    let jwtToken = '';
    let getUserData = await userMasterCtrl.getUserDetails(emailId); // get user details 

    // get user data 
    if (getUserData.success) {
      jwtToken = jwt.sign({
        data: JSON.stringify(getUserData.data)
      }, secret, { expiresIn: parseInt(expiryTime) * 60 });
    } else return Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, MessageTypes.userAuthentication.invalidLogin);
    // check whether the jwt is valid 
    if (jwt) {
      req.body.token = jwtToken; // jwt token 
      req.body.expiryTimeInMin = expiryTime; // expiry time
      req.body.password = undefined;
      return next();
    } else {
      console.error('Invalid Login !');
      return Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, MessageTypes.userAuthentication.invalidLogin);
    }

  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
