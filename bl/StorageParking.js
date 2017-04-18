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

function queryStorageParking(req,res,next){
    var params = req.params ;
    storageParkingDAO.getStorageParking(params,function(error,result){
        if (error) {
            logger.error(' queryStorageParking ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageParking ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorageParking(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        storageParkingDAO.getStorageParking(params,function(error,rows){
            if (error) {
                logger.error(' getStorageParking ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].car_id == 0){
                    that();
                }else{
                    logger.warn(' getStorageParking ' + 'failed');
                    resUtil.resetFailedRes(res,"parking is not empty");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        storageParkingDAO.updateStorageParkingMove(params,function(error,result){
            if (error) {
                logger.error(' updateStorageParkingMove ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageParkingMove ' + 'success');
                }else{
                    logger.warn(' updateStorageParkingMove ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
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
    })
}


module.exports = {
    queryStorageParking : queryStorageParking,
    updateStorageParking : updateStorageParking
}