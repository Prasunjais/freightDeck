const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const contractTransporterBid = new Schema({
  transporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    autopopulate: false
  },
  transporterName: {
    type: String,
    required: true
  },
  bidAmount: {

  },
  status: {
    type: Number,
    default: 1,
    enum: [0, 1]
  },
  isDeleted: {
    type: Number,
    default: 0,
    enum: [0, 1]
  },
}, {
  timestamps: true
});

// creating indexes
contractTransporterBid.index({

});

contractTransporterBid.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('contractTransporterBid', contractTransporterBid);