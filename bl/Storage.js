/**
 * Created by zwl on 2017/4/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageDAO = require('../dao/StorageDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Storage.js');

function createStorage(req,res,next){
    var params = req.params ;
    storageDAO.addStorage(params,function(error,result){
        if (error) {
            logger.error(' createStorage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createStorage ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryStorage(req,res,next){
    var params = req.params ;
    storageDAO.getStorage(params,function(error,result){
        if (error) {
            logger.error(' queryStorage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorage(req,res,next){
    var params = req.params ;
    storageDAO.updateStorage(params,function(error,result){
        if (error) {
            logger.error(' updateStorage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateStorageStatus (req,res,next){
    var params = req.params;
    storageDAO.updateStorageStatus(params,function(error,result){
        if (error) {
            logger.error(' updateStorageStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorageStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createStorage : createStorage,
    queryStorage : queryStorage,
    updateStorage : updateStorage,
    updateStorageStatus : updateStorageStatus
}