/**
 * Created by zwl on 2017/3/15.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveDAO = require('../dao/DriveDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Drive.js');

function createDrive(req,res,next){
    var params = req.params;
    driveDAO.addDrive(params,function(error,result){
        if (error) {
            logger.error(' createDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDrive ' + 'success');
            req.params.driverContent =" 新增司机 ";
            req.params.tid = result.insertId;
            req.params.driverOp =30;
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDrive(req,res,next){
    var params = req.params ;
    driveDAO.getDrive(params,function(error,result){
        if (error) {
            logger.error(' queryDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrive ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLicenseCount(req,res,next){
    var params = req.params ;
    driveDAO.getLicenseCount(params,function(error,result){
        if (error) {
            logger.error(' queryLicenseCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLicenseCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveCount(req,res,next){
    var params = req.params ;
    driveDAO.getDriveCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveOperateTypeTotal(req,res,next){
    var params = req.params ;
    driveDAO.getDriveOperateTypeTotal(params,function(error,result){
        if (error) {
            logger.error(' queryDriveOperateTypeTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveOperateTypeTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDrive(req,res,next){
    var params = req.params ;
    driveDAO.updateDrive(params,function(error,result){
        if (error) {
            logger.error(' updateDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDrive ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveImage(req,res,next){
    var params = req.params ;
    if(params.imageType==1){
        driveDAO.updateDriveImage(params,function(error,result){
            if (error) {
                logger.error(' updateDriveImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriveImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
    if(params.imageType==2){
        driveDAO.updateLicenseImage(params,function(error,result){
            if (error) {
                logger.error(' updateLicenseImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateLicenseImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
}

function updateDriveStatus (req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckBase({driveId:params.driveId},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getTruckBase ' +params.driveId+ sysMsg.CUST_DRIVE_BIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_DRIVE_BIND);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        driveDAO.updateDriveStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDriveStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriveStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDrive : createDrive,
    queryDrive : queryDrive,
    queryLicenseCount : queryLicenseCount,
    queryDriveCount : queryDriveCount,
    queryDriveOperateTypeTotal : queryDriveOperateTypeTotal,
    updateDrive : updateDrive,
    updateDriveImage : updateDriveImage,
    updateDriveStatus : updateDriveStatus
}