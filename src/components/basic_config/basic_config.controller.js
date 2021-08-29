const Model = require('./models/basic_config.model');
const {
  error,
  info
} = require('../../utils').logging;
const _ = require('lodash');
// getting the model 
class basicConfigController {

  // get the min salt round for hashing
  GET_MIN_SALT_ROUND_FOR_HASHING = () => {
    try {
      info('GET_MIN_SALT_ROUND_FOR_HASHING');

      // creating the data inside the database 
      return Model.aggregate([{
        $match: {
          'configName': 'MIN_SALT_ROUND_FOR_HASHING'
        }
      }]).allowDiskUse(true)
        .then((res) => {
          if (res && res.length)
            return {
              success: true,
              data: isNaN(res[0].configValue) ? 10 : parseInt(res[0].configValue)
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

  // get the token expiry time 
  GET_TOKEN_EXPIRY_TIME_IN_MIN = () => {
    try {
      info('GET_TOKEN_EXPIRY_TIME_IN_MIN');

      // creating the data inside the database 
      return Model.aggregate([{
        $match: {
          'configName': 'TOKEN_EXPIRY_TIME_IN_MIN'
        }
      }]).allowDiskUse(true)
        .then((res) => {
          if (res && res.length)
            return {
              success: true,
              data: isNaN(res[0].configValue) ? 40 : parseInt(res[0].configValue)
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

  // cryptr secret key
  GET_CRYPT_SECRET_KEY = () => {
    try {
      info('GET_CRYPT_SECRET_KEY');

      // creating the data inside the database 
      return Model.aggregate([{
        $match: {
          'configName': 'CRYPT_SECRET_KEY'
        }
      }]).allowDiskUse(true)
        .then((res) => {
          if (res && res.length)
            return {
              success: true,
              data: res[0].configValue ? '95445fg415df4222dfd22' : res[0].configValue
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
module.exports = new basicConfigController();
