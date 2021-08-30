const BaseController = require('../../baseController');
const Model = require('./models/contractTransporterBid.model');
const camelCase = require('camelcase');
const mongoose = require('mongoose');
const {
  error,
  info
} = require('../../../utils').logging;
const _ = require('lodash');


// getting the model 
class userController extends BaseController {
  // constructor 
  constructor() {
    super();
    this.messageTypes = this.messageTypes.userAuthentication;
  }

  // do something 
  signUp = async (req, res) => {
    try {
      info('Creating a new user !');
      let fullName = `${req.body.firstName} ${req.body.lastName}`;

      // inserting the new user into the db
      let isInserted = await Model.create({
        ...req.body, fullName
      })

      // is inserted 
      if (isInserted && !_.isEmpty(isInserted)) {
        // success response 
        isInserted.password = undefined;
        return this.success(req, res, this.status.HTTP_OK, isInserted, this.messageTypes.userCreatedSuccessfully);
      } else return this.errors(req, res, this.status.HTTP_CONFLICT, this.messageTypes.userNotCreated);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }

  // Internal function to check whether the email is unique or not 
  isEmailUnique = async (emailId) => {
    try {
      info(`Check whether the email ${emailId} of the user is unique or not !`);

      // creating the data inside the database 
      return Model
        .findOne({
          $or: [{
            'email': emailId
          }],
          'isDeleted': 0
        })
        .lean()
        .then((res) => {
          if (res && !_.isEmpty(res))
            return {
              success: false,
            };
          else return {
            success: true
          }
        });
      // catch any runtime error 
    } catch (e) {
      error(e);
      return {
        success: false,
        error: e
      }
    }
  }

  // login authentication
  login = async (req, res) => {
    try {
      info('Generating a new auth token !');

      // updating the last login details 
      await Model.updateOne({
        email: req.body.email,
        status: 1
      }, {
        $push: {
          loginDetails: {
            loggedInAt: new Date()
          }
        }
      })

      // is logged in 
      return this.success(req, res, this.status.HTTP_OK, req.body, this.messageTypes.userLoggedIn);

      // catch any runtime error 
    } catch (err) {
      error(err);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }

  // check whether email id exists or not 
  isEmailExist = async (emailId) => {
    try {
      info(`Check whether the email ${emailId} exist !`);

      // creating the data inside the database 
      return Model
        .findOne({
          'email': emailId,
          'isDeleted': 0
        })
        .lean()
        .then((res) => {
          if (res && !_.isEmpty(res))
            return {
              success: true,
              data: res
            };
          else return {
            success: false
          }
        });
      // catch any runtime error 
    } catch (e) {
      error(e);
      return {
        success: false,
        error: e
      }
    }
  }

  // get user password 
  getUserPassword = async (emailId) => {
    try {
      info(`Check whether the email ${emailId} exist !`);

      // creating the data inside the database 
      return Model
        .findOne({
          'email': emailId,
          'isDeleted': 0
        })
        .select('password')
        .lean()
        .then((res) => {
          if (res && !_.isEmpty(res))
            return {
              success: true,
              data: res
            };
          else return {
            success: false
          }
        });
      // catch any runtime error 
    } catch (e) {
      error(e);
      return {
        success: false,
        error: e
      }
    }
  }

  // get user details 
  getUserDetails = async (emailId) => {
    try {
      info(`Check whether the email ${emailId} exist !`);

      // creating the data inside the database 
      return Model
        .findOne({
          'email': emailId,
          'isDeleted': 0
        })
        .select({
          'firstName': 1, 'lastName': 1, 'email': 1, 'userType': 1
        })
        .lean()
        .then((res) => {
          if (res && !_.isEmpty(res))
            return {
              success: true,
              data: res
            };
          else return {
            success: false
          }
        });
      // catch any runtime error 
    } catch (e) {
      error(e);
      return {
        success: false,
        error: e
      }
    }
  }

}

// exporting the modules 
module.exports = new userController();