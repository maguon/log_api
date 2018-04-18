/**
 * Created by zwl on 2018/4/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var driveSalaryAccidentRelDAO = require('../dao/DriveSalaryAccidentRelDAO.js');
var truckAccidentDAO = require('../dao/TruckAccidentDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryAccidentRel.js');

function createDriveSalaryAccidentRel(req,res,next){
    var params = req.params ;
    var driveSalaryAccidentRelId = 0;
    Seq().seq(function(){
        var that = this;
        driveSalaryAccidentRelDAO.addDriveSalaryAccidentRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "事故编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDriveSalaryAccidentRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDriveSalaryAccidentRel ' + 'success');
                    driveSalaryAccidentRelId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createDriveSalaryAccidentRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.statStatus = sysConst.STAT_STATUS.stat;
        truckAccidentDAO.updateTruckAccidentStatStatus(params,function(error,result){
            if (error) {
                logger.error(' updateTruckAccidentStatStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckAccidentStatStatus ' + 'success');
                }else{
                    logger.warn(' updateTruckAccidentStatStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDriveSalaryTaskRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:driveSalaryAccidentRelId},null);
        return next();
    })
}

function queryDriveSalaryAccidentRel(req,res,next){
    var params = req.params ;
    driveSalaryAccidentRelDAO.getDriveSalaryAccidentRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryAccidentRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryAccidentRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveSalaryAccidentRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        driveSalaryAccidentRelDAO.deleteDriveSalaryAccidentRel(params,function(error,result){
            if (error) {
                logger.error(' removeDriveSalaryAccidentRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDriveSalaryAccidentRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeDriveSalaryAccidentRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.statStatus = sysConst.STAT_STATUS.not_stat;
        truckAccidentDAO.updateTruckAccidentStatStatus(params,function(error,result){
            if (error) {
                logger.error(' updateTruckAccidentStatStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckAccidentStatStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDriveSalaryAccidentRel : createDriveSalaryAccidentRel,
    queryDriveSalaryAccidentRel : queryDriveSalaryAccidentRel,
    removeDriveSalaryAccidentRel : removeDriveSalaryAccidentRel
}