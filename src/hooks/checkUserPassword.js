// Controller
const UserMasterCtrl = require('../components/onBoard/user/user.controller');
// Responses & others utils 
const bcrypt = require('bcryptjs');
const Response = require('../responses/response');
const StatusCodes = require('../facades/response');
const MessageTypes = require('../responses/types');
const Exceptions = require('../exceptions/Handler');
const {
  error,
  info
} = require('../utils').logging;

// exporting the hooks 
module.exports = async (req, res, next) => {
  try {
    info('check whether the user exists!');

    // get the email id 
    let emailId = req.body.email;

    // check whether the document type already exist or not 
    let getUserPassword = await UserMasterCtrl.getUserPassword(emailId);

    // check whether the document type already exists
    if (getUserPassword.success) {
      info('Comparing the Password'); // user doesnt exist 

      // bcrypt compare password 
      let isEqual = bcrypt.compareSync(req.body.password, getUserPassword.data.password); // true that means user password is correct

      // check whether the password matches
      if (isEqual) {
        req.body.userId = getUserPassword.id;
        return next();
      } else return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.userAuthentication.incorrectPassword);
    } else return Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.userAuthentication.incorrectPassword);

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
