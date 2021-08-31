// base joi 
const BaseJoi = require('joi');
// joi date extension 
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
// handling the joi response 
const Response = require('../../../responses/response');

// add joi schema 
const schemas = {
  // sign up validation 
  joiContractBid: Joi.object().keys({
    params: {
      contractId: Joi.string().trim().regex(/^[a-fA-F0-9]{24}$/).label('Contract Id').required().options({
        language: {
          string: {
            regex: {
              base: 'should be a valid mongoose Id.'
            }
          }
        }
      })
    },
    body: {
      bidAmount: Joi.number().min(10).required().label('Bid Amount')
    }
  }),
};

const options = {
  // generic option
  basic: {
    abortEarly: false,
    convert: true,
    allowUnknown: false,
    stripUnknown: true
  },
  // Options for Array of array
  array: {
    abortEarly: false,
    convert: true,
    allowUnknown: true,
    stripUnknown: {
      objects: true
    }
  }
};

module.exports = {
  // exports validate admin signup
  joiContractBid: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.joiContractBid;
    let option = options.basic;

    // validating the schema 
    schema.validate({ params: req.params, body: req.body }, option).then(() => {
      return next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });

      // returning the response 
      Response.joierrors(req, res, err);
    });
  },
}
