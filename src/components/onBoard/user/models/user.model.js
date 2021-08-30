const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
require('mongoose-type-email');
const Schema = mongoose.Schema;

// schema
const users = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true
  },
  password: {
    type: String
  },
  userType: {
    type: String,
    enum: ['contractor', 'transporter'],
    default: 'transporter'
  },
  loginDetails: [{
    loggedInAt: {
      type: Date
    },
    loginIp: {
      type: String,
      default: ''
    }
  }],
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
users.index({
  'email': 1
});

users.plugin(autopopulate);

// exporting the entire module
module.exports = mongoose.model('users', users, 'users');