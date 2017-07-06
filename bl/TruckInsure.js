/**
 * Created by zwl on 2017/7/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckInsureDAO = require('../dao/TruckInsureDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckInsure.js');

function createTruckInsure(req,res,next){
    var params = req.params ;
    truckInsureDAO.addTruckInsure(params,function(error,result){
        if (error) {
            logger.error(' createTruckInsure ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruckInsure ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryTruckInsure(req,res,next){
    var params = req.params ;
    truckInsureDAO.getTruckInsure(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsure ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsure ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckInsure(req,res,next){
    var params = req.params ;
    truckInsureDAO.updateTruckInsure(params,function(error,result){
        if (error) {
            logger.error(' updateTruckInsure ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckInsure ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckInsure : createTruckInsure,
    queryTruckInsure : queryTruckInsure,
    updateTruckInsure : updateTruckInsure
}