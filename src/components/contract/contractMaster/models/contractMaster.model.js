const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

// schema
const contractMaster = new Schema({
  contractId: {
    type: String,
  },
  division: {
    type: String,
  },
  bidStartTime: {
    type: Date
  },
  bidEndTime: {
    type: Date
  },
  destinationAddress: {
    street: {
      type: String
    },
    city: {
      type: String
    },
    pincode: {
      type: Number
    },
    state: {
      type: String
    }
  },
  goodsDescription: {
    type: String,
  },
  bidInitialAmount: {
    type: Number,
  },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    autopopulate: false
  },
  createdBy: {
    type: String
  },
  seq: {
    type: Number
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
contractMaster.index({
});

// Mongoose Auto Increement 
contractMaster.plugin(autoIncrement, {
  inc_field: 'seq'
});

contractMaster.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('contractMaster', contractMaster, 'contractmaster');