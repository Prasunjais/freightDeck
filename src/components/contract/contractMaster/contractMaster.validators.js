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
  joiContractPost: Joi.object().keys({
    division: Joi.string().trim().label('division').required(),
    bidStartTime: Joi.date().format('DD/MM/YYYY H:mm').utc().options({
      convert: true,
      language: {
        any: {
          format: 'should be a valid format'
        }
      }
    }).label('Bid Start Time').required().min(new Date()),
    bidEndTime: Joi.date().format('DD/MM/YYYY H:mm').utc().options({
      convert: true,
      language: {
        any: {
          format: 'should be a valid format'
        }
      }
    }).label('Bid End Time').min(Joi.ref('bidStartTime')).required(),

    destinationAddress: {
      street: Joi.string().trim().label('Street').required(),
      city: Joi.string().trim().label('City').required(),
      pincode: Joi.number().min(0).max(999999).label('Pincode').optional().allow(''),
      state: Joi.string().trim().label('State').required(),
    },
    goodsDescription: Joi.string().trim().min(20).max(400).label('Goods Description').required(),
    bidInitialAmount: Joi.number().required().min(1000).max(9999999999)
  }),

  // get list 
  joiContractGet: Joi.object().keys({
    page: Joi.number().integer().min(1).label('Page').required(),
    search: Joi.string().trim().lowercase().label('Search Query').optional().allow(''),
  }),

  // get details
  joiContractGetDetails: Joi.object().keys({
    contractId: Joi.string().trim().regex(/^[a-fA-F0-9]{24}$/).label('Contract Id').required().options({
      language: {
        string: {
          regex: {
            base: 'should be a valid mongoose Id.'
          }
        }
      }
    })
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
  joiContractPost: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.joiContractPost;
    let option = options.basic;

    // validating the schema 
    schema.validate(req.body, option).then(() => {
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

  // exports validate admin signin 
  joiContractGet: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.joiContractGet;
    let option = options.basic;

    // validating the schema 
    schema.validate(req.query, option).then(() => {
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

  // exports validate contract get details 
  joiContractGetDetails: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.joiContractGetDetails;
    let option = options.basic;

    // validating the schema 
    schema.validate(req.params, option).then(() => {
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
