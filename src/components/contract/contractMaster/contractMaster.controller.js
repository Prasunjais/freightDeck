const BaseController = require('../../baseController');
const Model = require('./models/contractMaster.model');
const BasicCtrl = require('../../basic_config/basic_config.controller');
const camelCase = require('camelcase');
const mongoose = require('mongoose');
const moment = require('moment');
const {
  error,
  info
} = require('../../../utils').logging;
const _ = require('lodash');
// padding the numbers
const pad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};


// getting the model 
class contractMaster extends BaseController {
  // constructor 
  constructor() {
    super();
    this.messageTypes = this.messageTypes.contracts;
  }

  // do something 
  post = async (req, res) => {
    try {
      info('Creating a new contract !');
      let contractId = 'N/A';
      // date today 
      let dateToday = new Date();

      // creating a new contract 
      let newContract = await Model.create({
        ...req.body,
        bidStartTime: moment(req.body.bidStartTime, 'DD/MM/YYYY H:mm').toDate(),
        bidEndTime: moment(req.body.bidEndTime, 'DD/MM/YYYY H:mm').toDate(),
        createdById: req.user._id,
        createdBy: req.user.email,
        status: 0
      });

      // if division is present
      if (req.body.division) {
        contractId = `FD/${req.body.division}/${dateToday.getFullYear()}/${pad(parseInt(dateToday.getMonth() + 1), 2)}/${pad(parseInt(newContract.seq % 99999), 5)}`;
      };

      // update beat plan with the new id 
      let isUpdated = await Model.updateOne({
        '_id': mongoose.Types.ObjectId(newContract._id)
      }, {
        'contractId': contractId,
        'status': 1
      }, {
        lean: true,
        multi: false,
        upsert: false,
        new: true
      })

      // success 
      return this.success(req, res, this.status.HTTP_OK, { ...newContract.toObject(), contractId: contractId }, this.messageTypes.contractCreatedSuccess);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, e));
    }
  }

  // get the list of contracts
  get = async (req, res) => {
    try {
      info('Get List of Contracts !');

      // get the query params
      let page = req.query.page || 1,
        pageSize = await BasicCtrl.GET_PAGINATION_LIMIT().then((res) => { if (res.success) return res.data; else return 60; }),
        searchKey = req.query.search || '',
        sortBy = req.query.sortBy || 'createdAt',
        sortingArray = {},
        date = new Date();

      sortingArray[sortBy] = -1;
      let skip = parseInt(page - 1) * pageSize;

      // get the list of asm in the allocated city
      let searchObject = {
        'status': 1,
        'isDeleted': 0,
        'bidStartTime': {
          $lte: date
        },
        'bidEndTime': {
          $gte: date
        }
      };

      let dataToProject = {
        '_id': 1,
        'division': 1,
        'bidStartTime': 1,
        'bidEndTime': 1,
        'destinationAddress': 1,
        'goodsDescription': 1,
        'bidInitialAmount': 1,
        'contractId': 1,
        'createdAt': 1
      }

      // creating a match object
      if (searchKey !== '' && isNaN(searchKey)) {
        searchObject = {
          ...searchObject,
          '$or': [{
            'goodsDescription': {
              $regex: searchKey,
              $options: 'is'
            }
          }, {
            'contractId': {
              $regex: searchKey,
              $options: 'is'
            }
          }]
        };
      } else if (searchKey !== '' && !isNaN(searchKey)) {
        searchObject = {
          ...searchObject,
          'bidInitialAmount': parseInt(searchKey)
        }
      }

      // get the total customer
      let totalContracts = await Model.countDocuments({
        ...searchObject
      });

      let contractLists = await Model.aggregate([{
        $match: {
          ...searchObject
        }
      }, {
        $project: {
          ...dataToProject
        }
      }, {
        $sort: sortingArray
      }, {
        $skip: skip
      }, {
        $limit: pageSize
      }, {
        $lookup: {
          from: 'contracttransporterbids',
          let: {
            'id': '$_id'
          },
          pipeline: [{
            $match: {
              'status': 1,
              'isDeleted': 0,
              '$expr': {
                '$eq': ['$contractId', '$$id']
              }
            }
          }, {
            $project: {
              'transporterId': 1,
              'bidAmount': 1
            }
          }, {
            $sort: {
              'bidAmount': 1
            },
          }, {
            $lookup: {
              from: 'users',
              let: {
                'id': '$transporterId'
              },
              pipeline: [
                {
                  $match: {
                    'status': 1,
                    'isDeleted': 0,
                    '$expr': {
                      '$eq': ['$_id', '$$id']
                    }
                  }
                }, {
                  $project: {
                    'fullName': 1
                  }
                }],
              as: 'transporter'
            }
          }, {
            $unwind: {
              path: '$transporter',
              preserveNullAndEmptyArrays: true
            }
          }],
          as: 'transporterBiddingMapping'
        }
      }, {
        "$addFields": {
          "LowestBid": {
            $ifNull: [{ $arrayElemAt: ['$transporterBiddingMapping', 0] }, {
              "bidAmount": 0,
              "transporterId": "",
              "transporter": {
                "_id": "",
                "fullName": "N/A"
              }
            }]
          }
        }
      }]).allowDiskUse(true);


      // success 
      return this.success(req, res, this.status.HTTP_OK, {
        results: contractLists,
        pageMeta: {
          skip: parseInt(skip),
          pageSize: pageSize,
          total: totalContracts
        }
      }, this.messageTypes.contractListedSuccessfully);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, e));
    }
  }

  // get details 
  getDetails = async (req, res) => {
    try {
      info('Get List of Contracts !');

      // get the query params
      let contractId = req.params.contractId;

      // get the list of asm in the allocated city
      let searchObject = {
        'status': 1,
        'isDeleted': 0,
        '_id': mongoose.Types.ObjectId(contractId)
      };

      let dataToProject = {
        '_id': 1,
        'division': 1,
        'bidStartTime': 1,
        'bidEndTime': 1,
        'destinationAddress': 1,
        'goodsDescription': 1,
        'bidInitialAmount': 1,
        'contractId': 1,
        'createdAt': 1
      }

      let contractDetails = await Model.aggregate([{
        $match: {
          ...searchObject
        }
      }, {
        $project: {
          ...dataToProject
        }
      }, {
        $lookup: {
          from: 'contracttransporterbids',
          let: {
            'id': '$_id'
          },
          pipeline: [{
            $match: {
              'status': 1,
              'isDeleted': 0,
              '$expr': {
                '$eq': ['$contractId', '$$id']
              }
            }
          }, {
            $project: {
              'transporterId': 1,
              'bidAmount': 1
            }
          }, {
            $sort: {
              'bidAmount': 1
            },
          }, {
            $lookup: {
              from: 'users',
              let: {
                'id': '$transporterId'
              },
              pipeline: [
                {
                  $match: {
                    'status': 1,
                    'isDeleted': 0,
                    '$expr': {
                      '$eq': ['$_id', '$$id']
                    }
                  }
                }, {
                  $project: {
                    'fullName': 1
                  }
                }],
              as: 'transporter'
            }
          }, {
            $unwind: {
              path: '$transporter',
              preserveNullAndEmptyArrays: true
            }
          }],
          as: 'transporterBiddingMapping'
        }
      }]).allowDiskUse(true);

      // success 
      return this.success(req, res, this.status.HTTP_OK, contractDetails[0], this.messageTypes.contractDetailsSuccessfully);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, e));
    }
  }

  // is valid 
  isValid = async (contractId) => {
    try {
      info('Checking whether the Contract Id is valid or not!');

      // creating the data inside the database 
      return Model
        .findOne({
          '_id': mongoose.Types.ObjectId(contractId),
          'status': 1,
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

      // catch any error 
    } catch (err) {
      error(err);
      return {
        success: false,
        error: err
      }
    }
  }

  // Internal Function check whether the contract is valid and open
  isValidOpenContract = async (contractId) => {
    try {
      info('Get Contract\'s Details !');

      // get the query params
      let date = new Date();

      // get the list of asm in the allocated city
      let searchObject = {
        'status': 1,
        'isDeleted': 0,
        '_id': mongoose.Types.ObjectId(contractId),
        'bidStartTime': {
          $lte: date
        },
        'bidEndTime': {
          $gte: date
        }
      };

      let dataToProject = {
        '_id': 1,
        'division': 1,
        'bidStartTime': 1,
        'bidEndTime': 1,
        'destinationAddress': 1,
        'goodsDescription': 1,
        'bidInitialAmount': 1,
        'contractId': 1,
        'createdAt': 1
      }

      // contract id
      return Model.aggregate([{
        $match: {
          ...searchObject
        }
      }, {
        $project: {
          ...dataToProject
        }
      }]).allowDiskUse(true)
        .then((res) => {
          if (res && res.length)
            return {
              success: true,
              data: res[res.length - 1]
            };
          else return {
            success: false
          }
        });


      // catch any runtime error 
    } catch (e) {
      error(e);
      return this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, e));
    }
  }
}

// exporting the modules 
module.exports = new contractMaster();
