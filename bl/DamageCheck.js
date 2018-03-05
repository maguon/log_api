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
    Seq().seq(function(){
        var that = this;
        if(params.checkButton==2){
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
        }else{
            var myDate = new Date();
            var strDate = moment(myDate).format('YYYYMMDD');
            params.dateId = parseInt(strDate);
            damageCheckDAO.updateDamageCheck(params,function(error,result){
                if (error) {
                    logger.error(' updateDamageCheck ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateDamageCheck ' + 'success');
                        that();
                    } else {
                        logger.warn(' updateDamageCheck ' + 'failed');
                        resUtil.resetFailedRes(res," 质损处理操作失败 ");
                        return next();
                    }
                }
            })
        }
    }).seq(function () {
        params.damageStatus = sysConst.DAMAGE_STATUS.completed;
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

function updateDamageCheckIndemnityStatus(req,res,next){
    var params = req.params;
    damageCheckDAO.updateDamageCheckIndemnityStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDamageCheckIndemnityStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageCheckIndemnityStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
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
    updateDamageCheckIndemnityStatus : updateDamageCheckIndemnityStatus,
    queryDamageCheckMonthStat : queryDamageCheckMonthStat,
    queryDamageCheckWeekStat : queryDamageCheckWeekStat,
    queryDamageCheckUnderMonthStat : queryDamageCheckUnderMonthStat,
    queryDamageCheckUnderWeekStat : queryDamageCheckUnderWeekStat
}