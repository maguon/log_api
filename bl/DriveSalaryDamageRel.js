/**
 * Created by zwl on 2018/4/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var driveSalaryDamageRelDAO = require('../dao/DriveSalaryDamageRelDAO.js');
var damageDAO = require('../dao/DamageDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryDamageRel.js');

function createDriveSalaryDamageRel(req,res,next){
    var params = req.params ;
    var driveSalaryDamageRelId = 0;
    Seq().seq(function(){
        var that = this;
        driveSalaryDamageRelDAO.addDriveSalaryDamageRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "质损编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDriveSalaryDamageRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDriveSalaryDamageRel ' + 'success');
                    driveSalaryDamageRelId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createDriveSalaryDamageRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.statStatus = sysConst.STAT_STATUS.stat;
        damageDAO.updateDamageStatStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDamageStatStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageStatStatus ' + 'success');
                }else{
                    logger.warn(' updateDamageStatStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDriveSalaryTaskRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:driveSalaryDamageRelId},null);
        return next();
    })
}

function queryDriveSalaryDamageRel(req,res,next){
    var params = req.params ;
    driveSalaryDamageRelDAO.getDriveSalaryDamageRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryDamageRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryDamageRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveSalaryDamageRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        driveSalaryDamageRelDAO.deleteDriveSalaryDamageRel(params,function(error,result){
            if (error) {
                logger.error(' removeDriveSalaryDamageRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDriveSalaryDamageRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeDriveSalaryDamageRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.statStatus = sysConst.STAT_STATUS.not_stat;
        damageDAO.updateDamageStatStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDamageStatStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDamageStatStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDriveSalaryDamageRel : createDriveSalaryDamageRel,
    queryDriveSalaryDamageRel : queryDriveSalaryDamageRel,
    removeDriveSalaryDamageRel : removeDriveSalaryDamageRel
}