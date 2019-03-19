/**
 * Created by zwl on 2018/6/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var driveSalaryExceedOilRelDAO = require('../dao/DriveSalaryExceedOilRelDAO.js');
var driveExceedOilDAO = require('../dao/DriveExceedOilDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryExceedOilRel.js');

function createDriveSalaryExceedOilRel(req,res,next){
    var params = req.params ;
    var driveSalaryExceedOilRelId = 0;
    Seq().seq(function(){
        var that = this;
        driveSalaryExceedOilRelDAO.addDriveSalaryExceedOilRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "超油编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDriveSalaryExceedOilRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDriveSalaryExceedOilRel ' + 'success');
                    driveSalaryExceedOilRelId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createDriveSalaryExceedOilRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.settleStatus = sysConst.SETTLE_STATUS.settle;
        driveExceedOilDAO.updateDriveExceedOilStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDriveExceedOilStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDriveExceedOilStatus ' + 'success');
                }else{
                    logger.warn(' updateDriveExceedOilStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDriveSalaryTaskRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:driveSalaryExceedOilRelId},null);
        return next();
    })
}

function queryDriveSalaryExceedOilRel(req,res,next){
    var params = req.params ;
    driveSalaryExceedOilRelDAO.getDriveSalaryExceedOilRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryExceedOilRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryExceedOilRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveSalaryExceedOilRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        driveSalaryExceedOilRelDAO.deleteDriveSalaryExceedOilRel(params,function(error,result){
            if (error) {
                logger.error(' removeDriveSalaryExceedOilRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDriveSalaryExceedOilRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeDriveSalaryExceedOilRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.settleStatus = sysConst.SETTLE_STATUS.not_settle;
        driveExceedOilDAO.updateDriveExceedOilStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDriveExceedOilStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriveExceedOilStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDriveSalaryExceedOilRel : createDriveSalaryExceedOilRel,
    queryDriveSalaryExceedOilRel : queryDriveSalaryExceedOilRel,
    removeDriveSalaryExceedOilRel : removeDriveSalaryExceedOilRel
}