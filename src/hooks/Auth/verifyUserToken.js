// Responses & others utils 
const Response = require('../../responses/response');
const StatusCodes = require('../../facades/response');
const MessageTypes = require('../../responses/types');
const Exceptions = require('../../exceptions/Handler');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.secret;
const {
  error,
  info
} = require('../../utils').logging;

// exporting the hooks 
module.exports = async (req, res, next) => {
  try {
    info('Verifying the user token');

    // checking the token
    if (req.headers['x-access-token'] === undefined) {
      error('x-access-token header not present');
      return Response.errors(req, res, StatusCodes.HTTP_UNAUTHORIZED, MessageTypes.userAuthentication.authTokenIsRequired);
    }

    // getting the token 
    let token = req.headers['x-access-token'];

    // check token is present 
    if (!token) {
      return Response.errors(req, res, StatusCodes.HTTP_UNAUTHORIZED, MessageTypes.userAuthentication.invalidToken);
    }

    // get jwt payload 
    let payload = await jwt.verify(token, jwtSecret, function (err, payload) {
      if (err) {
        error('JWT Expired or Invalid Token !', err); // route doesnt exist 
        return {
          error: 'tokenExpired'
        }
      } else return payload;
    });

    if (payload && payload.error && payload.error == 'tokenExpired') {
      return Response.errors(req, res, StatusCodes.HTTP_UNAUTHORIZED, MessageTypes.userAuthentication.tokenExpired);
    }

    // console.log('The payload here is ---> ', payload.data);
    if (payload && payload.data && JSON.parse(payload.data)) {
      req.user = {
        token: token,
        ...JSON.parse(payload.data)
      };

      // move on
      return next();
    } else {
      return Response.errors(req, res, StatusCodes.HTTP_UNAUTHORIZED, MessageTypes.authentication.unauthorizedUser);
    }
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
