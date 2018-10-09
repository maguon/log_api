/**
 * Created by zwl on 2018/6/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var driveSalaryPeccancyRelDAO = require('../dao/DriveSalaryPeccancyRelDAO.js');
var drivePeccancyDAO = require('../dao/DrivePeccancyDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryPeccancyRel.js');

function createDriveSalaryPeccancyRel(req,res,next){
    var params = req.params ;
    var driveSalaryPeccancyRelId = 0;
    Seq().seq(function(){
        var that = this;
        driveSalaryPeccancyRelDAO.addDriveSalaryPeccancyRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "违章编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDriveSalaryPeccancyRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDriveSalaryPeccancyRel ' + 'success');
                    driveSalaryPeccancyRelId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createDriveSalaryPeccancyRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.statStatus = sysConst.STAT_STATUS.stat;
        drivePeccancyDAO.updateDrivePeccancyStatStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDrivePeccancyStatStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDrivePeccancyStatStatus ' + 'success');
                }else{
                    logger.warn(' updateDrivePeccancyStatStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDriveSalaryTaskRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:driveSalaryPeccancyRelId},null);
        return next();
    })
}

function queryDriveSalaryPeccancyRel(req,res,next){
    var params = req.params ;
    driveSalaryPeccancyRelDAO.getDriveSalaryPeccancyRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryPeccancyRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryPeccancyRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveSalaryPeccancyRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        driveSalaryPeccancyRelDAO.deleteDriveSalaryPeccancyRel(params,function(error,result){
            if (error) {
                logger.error(' removeDriveSalaryPeccancyRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDriveSalaryPeccancyRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeDriveSalaryPeccancyRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.statStatus = sysConst.STAT_STATUS.not_stat;
        drivePeccancyDAO.updateDrivePeccancyStatStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDrivePeccancyStatStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDrivePeccancyStatStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDriveSalaryPeccancyRel : createDriveSalaryPeccancyRel,
    queryDriveSalaryPeccancyRel : queryDriveSalaryPeccancyRel,
    removeDriveSalaryPeccancyRel : removeDriveSalaryPeccancyRel
}