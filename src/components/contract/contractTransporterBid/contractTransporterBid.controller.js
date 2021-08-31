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
    this.messageTypes = this.messageTypes.contractTransporterBid;
  }

  // do something 
  placeBid = async (req, res) => {
    try {
      info('Creating a new user !');
      let contractId = req.params.contractId;

      // data to push 
      let dataToPush = {
        contractId: mongoose.Types.ObjectId(contractId),
        bidAmount: parseFloat(req.body.bidAmount),
        transporterId: mongoose.Types.ObjectId(req.body.transporterDetails._id),
        transporterName: req.body.transporterDetails.fullName
      };

      // updating the model with the bid
      let isUpdated = await Model.updateOne({
        contractId: mongoose.Types.ObjectId(contractId),
        transporterId: mongoose.Types.ObjectId(req.body.transporterDetails._id),
      }, {
        $set: {
          ...dataToPush
        }
      }, {
        upsert: true,
        new: true
      }).lean()

      // is inserted 
      if (isUpdated && !_.isEmpty(isUpdated)) {
        // success response 
        return this.success(req, res, this.status.HTTP_OK, isUpdated, this.messageTypes.bidPlacedSuccessfully);
      } else return this.errors(req, res, this.status.HTTP_CONFLICT, this.messageTypes.errorWhilePlacingBid);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, e));
    }
  }
}

// exporting the modules 
module.exports = new userController();
