/**
 * Created by zwl on 2017/11/14.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var damageCheckDAO = require('../dao/DamageCheckDAO.js');
var damageDAO = require('../dao/DamageDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DamageCheck.js');

function createDamageCheck(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        damageCheckDAO.addDamageCheck(params,function(error, result) {
            if (error) {
                logger.error(' createDamageCheck ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDamageCheck ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res," 质损处理操作失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.damageStatus = sysConst.DAMAGE_STATUS.in_process;
        damageDAO.updateDamageStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDamageStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDamageStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDamageCheck(req,res,next){
    var params = req.params;
    damageCheckDAO.getDamageCheck(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheck ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDamageCheck(req,res,next){
    var params = req.params;
    damageCheckDAO.updateDamageCheck(params,function(error,result){
        if (error) {
            logger.error(' updateDamageCheck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageCheck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateScPayment(req,res,next){
    var params = req.params;
    damageCheckDAO.updateScPayment(params,function(error,result){
        if (error) {
            logger.error(' updateScPayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateScPayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDamageCheckIndemnityStatus(req,res,next){
    var params = req.params;
    Seq().seq(function() {
        var that = this;
        damageCheckDAO.updateDamageCheckIndemnityStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDamageCheckIndemnityStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageCheckIndemnityStatus ' + 'success');
                    that();
                }else{
                    logger.warn(' updateDamageCheckIndemnityStatus ' + 'failed');
                    resUtil.resetFailedRes(res," 赔款状态更新失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        damageCheckDAO.updateDamageCheckDateId(params,function(error,result){
            if (error) {
                logger.error(' updateDamageCheckDateId ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageCheckDateId ' + 'success');
                    that();
                }else{
                    logger.warn(' updateDamageCheckDateId ' + 'failed');
                    resUtil.resetFailedRes(res," 赔款处理结束时间更新失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.damageStatus=3;
        damageDAO.updateDamageStatusCheckId(params,function(error,result){
            if (error) {
                logger.error(' updateDamageStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageStatus ' + 'success');
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }else{
                    logger.warn(' updateDamageStatus ' + 'failed');
                    resUtil.resetFailedRes(res," 质损状态更新失败 ");
                    return next();
                }
            }
        })
    })

}

function queryDamageCheckMonthStat(req,res,next){
    var params = req.params;
    damageCheckDAO.getDamageCheckMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheckMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheckMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageCheckWeekStat(req,res,next){
    var params = req.params;
    damageCheckDAO.getDamageCheckWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheckWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheckWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageCheckUnderMonthStat(req,res,next){
    var params = req.params;
    damageCheckDAO.getDamageCheckUnderMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheckUnderMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheckUnderMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageCheckUnderWeekStat(req,res,next){
    var params = req.params;
    damageCheckDAO.getDamageCheckUnderWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheckUnderWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheckUnderWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    createDamageCheck : createDamageCheck,
    queryDamageCheck : queryDamageCheck,
    updateDamageCheck : updateDamageCheck,
    updateScPayment : updateScPayment,
    updateDamageCheckIndemnityStatus : updateDamageCheckIndemnityStatus,
    queryDamageCheckMonthStat : queryDamageCheckMonthStat,
    queryDamageCheckWeekStat : queryDamageCheckWeekStat,
    queryDamageCheckUnderMonthStat : queryDamageCheckUnderMonthStat,
    queryDamageCheckUnderWeekStat : queryDamageCheckUnderWeekStat
}