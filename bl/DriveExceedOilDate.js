/**
 * Created by zwl on 2019/5/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilDateDAO = require('../dao/DriveExceedOilDateDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDate.js');

function createDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.addDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' createDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveExceedOilDate ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.getDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilMonth(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.getDriveExceedOilMonth(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilMonth ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.updateDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOilDate ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveExceedOilDate : createDriveExceedOilDate,
    queryDriveExceedOilDate : queryDriveExceedOilDate,
    queryDriveExceedOilMonth : queryDriveExceedOilMonth,
    updateDriveExceedOilDate : updateDriveExceedOilDate
}
