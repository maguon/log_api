/**
 * Created by zwl on 2017/4/14.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageParking.js');

function updateStorageParking(req,res,next){
    var params = req.params ;
    storageParkingDAO.updateStorageParking(params,function(error,result){
        if (error) {
            logger.error(' updateStorageParking ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageParking ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateStorageParkingOut(req,res,next){
    var params = req.params ;
    storageParkingDAO.updateStorageParkingOut(params,function(error,result){
        if (error) {
            logger.error(' updateStorageParkingOut ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageParkingOut ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    updateStorageParking : updateStorageParking,
    updateStorageParkingOut : updateStorageParkingOut
}