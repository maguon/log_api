/**
 * Created by zwl on 2018/6/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilDAO = require('../dao/DriveExceedOilDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOil.js');

function createDriveExceedOil(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.addDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' createDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveExceedOil ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOil(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOil ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOil(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.updateDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOil ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveExceedOil : createDriveExceedOil,
    queryDriveExceedOil : queryDriveExceedOil,
    updateDriveExceedOil : updateDriveExceedOil
}
