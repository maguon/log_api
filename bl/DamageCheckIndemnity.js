/**
 * Created by zwl on 2018/3/2.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var damageCheckIndemnityDAO = require('../dao/DamageCheckIndemnityDAO.js');
var damageCheckDAO = require('../dao/DamageCheckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DamageCheckIndemnity.js');

function createDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    var indemnityId = 0;
    Seq().seq(function(){
        var that = this;
        damageCheckIndemnityDAO.addDamageCheckIndemnity(params,function(error,result){
            if (error) {
                logger.error(' createDamageCheckIndemnity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDamageCheckIndemnity ' + 'success');
                    indemnityId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create damageCheckIndemnity failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.damageIndemnityStatus = sysConst.DAMAGE_INDEMNITY__STATUS.yes;
        damageCheckDAO.updateDamageCheckIndemnityStatus(params,function(err,result){
            if (err) {
                logger.error(' updateDamageCheckIndemnityStatus ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageCheckIndemnityStatus ' + 'success');
                }else{
                    logger.warn(' updateDamageCheckIndemnityStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDamageCheckIndemnity ' + 'success');
        resUtil.resetCreateRes(res,{insertId:indemnityId},null);
        return next();
    })
}

function queryDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.getDamageCheckIndemnity(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheckIndemnity ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateDamageCheckIndemnity(params,function(error,result){
        if (error) {
            logger.error(' updateDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageCheckIndemnity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDamageCheckIndemnityImage(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateDamageCheckIndemnityImage(params,function(error,result){
        if (error) {
            logger.error(' updateDamageCheckIndemnityImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageCheckIndemnityImage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateIndemnity(params,function(error,result){
        if (error) {
            logger.error(' updateIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateIndemnity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateIndemnityStatus(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        damageCheckIndemnityDAO.updateIndemnityStatus(params,function(error,result){
            if (error) {
                logger.error(' updateIndemnityStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateIndemnityStatus ' + 'success');
                    that();
                }else{
                    logger.warn(' updateIndemnityStatus ' + 'failed');
                    resUtil.resetFailedRes(res," 处理结束失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.indemnityDate = myDate;
        damageCheckIndemnityDAO.updateIndemnityFinishTime(params,function(error,result){
            if (error) {
                logger.error(' updateIndemnityDate ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateIndemnityDate ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryIndemnityStatusCount(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.getIndemnityStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryIndemnityStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryIndemnityStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryIndemnityMonthStat(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.getIndemnityMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryIndemnityMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryIndemnityMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDamageCheckIndemnity : createDamageCheckIndemnity,
    queryDamageCheckIndemnity : queryDamageCheckIndemnity,
    updateDamageCheckIndemnity : updateDamageCheckIndemnity,
    updateDamageCheckIndemnityImage : updateDamageCheckIndemnityImage,
    updateIndemnity : updateIndemnity,
    updateIndemnityStatus : updateIndemnityStatus,
    queryIndemnityStatusCount : queryIndemnityStatusCount,
    queryIndemnityMonthStat : queryIndemnityMonthStat
}