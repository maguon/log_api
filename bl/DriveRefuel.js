/**
 * Created by zwl on 2017/9/8.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveRefuelDAO = require('../dao/DriveRefuelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DriveRefuel.js');

function createDriveRefuel(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    driveRefuelDAO.addDriveRefuel(params,function(error,result){
        if (error) {
            logger.error(' createDriveRefuel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveRefuel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveRefuel(req,res,next){
    var params = req.params ;
    driveRefuelDAO.getDriveRefuel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveRefuel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveRefuel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryRefuelVolumeMoneyTotal(req,res,next){
    var params = req.params ;
    driveRefuelDAO.getRefuelVolumeMoneyTotal(params,function(error,result){
        if (error) {
            logger.error(' queryRefuelVolumeMoneyTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRefuelVolumeMoneyTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveRefuelStatus(req,res,next){
    var params = req.params;
    driveRefuelDAO.updateDriveRefuelStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDriveRefuelStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveRefuelStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryRefuelMonthStat(req,res,next){
    var params = req.params ;
    driveRefuelDAO.getRefuelMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryRefuelMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRefuelMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
function queryRefuelWeekStat(req,res,next){
    var params = req.params ;
    driveRefuelDAO.getRefuelWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryRefuelWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRefuelWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    createDriveRefuel : createDriveRefuel,
    queryDriveRefuel : queryDriveRefuel,
    queryRefuelVolumeMoneyTotal : queryRefuelVolumeMoneyTotal,
    updateDriveRefuelStatus : updateDriveRefuelStatus ,
    queryRefuelMonthStat  : queryRefuelMonthStat ,
    queryRefuelWeekStat : queryRefuelWeekStat
}
