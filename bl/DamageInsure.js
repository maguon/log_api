/**
 * Created by zwl on 2017/11/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var damageInsureDAO = require('../dao/DamageInsureDAO.js');
var damageInsureRelDAO = require('../dao/DamageInsureRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DamageInsure.js');

function createInsure(req,res,next){
    var params = req.params ;
    var damageInsureId = 0;
    Seq().seq(function(){
        var that = this;
        damageInsureDAO.addDamageInsure(params,function(error,result){
            if (error) {
                logger.error(' createInsure ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createInsure ' + 'success');
                    damageInsureId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create Insure failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.damageInsureId = damageInsureId;
        damageInsureRelDAO.addDamageInsureRel(params,function(err,result){
            if (err) {
                logger.error(' createDamageInsureRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDamageInsureRel ' + 'success');
                }else{
                    logger.warn(' createDamageInsureRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createInsure ' + 'success');
        resUtil.resetCreateRes(res,{insertId:damageInsureId},null);
        return next();
    })
}

function createDamageInsure(req,res,next){
    var params = req.params ;
    var damageInsureId = 0;
    Seq().seq(function(){
        var that = this;
        damageInsureDAO.addDamageInsure(params,function(error,result){
            if (error) {
                logger.error(' createDamageInsure ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDamageInsure ' + 'success');
                    damageInsureId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create damageInsure failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var damageIds = params.damageIds;
        var rowArray = [] ;
        rowArray.length= damageIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                damageInsureId : damageInsureId,
                damageId : damageIds[i],
                row : i+1,
            }
            damageInsureRelDAO.addDamageInsureRel(subParams,function(err,result){
                if (err) {
                    logger.error(' createDamageInsureRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createDamageInsureRel ' + 'success');
                    }else{
                        logger.warn(' createDamageInsureRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createDamageInsure ' + 'success');
        resUtil.resetCreateRes(res,{insertId:damageInsureId},null);
        return next();
    })
}

function queryDamageInsure(req,res,next){
    var params = req.params ;
    damageInsureDAO.getDamageInsure(params,function(error,result){
        if (error) {
            logger.error(' queryDamageInsure ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageInsure ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDamageInsure(req,res,next){
    var params = req.params;
    damageInsureDAO.updateDamageInsure(params,function(error,result){
        if (error) {
            logger.error(' updateDamageInsure ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageInsure ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDamageInsureStatus(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    damageInsureDAO.updateDamageInsureStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDamageInsureStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageInsureStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryDamageInsureMonthStat(req,res,next){
    var params = req.params ;
    damageInsureDAO.getDamageInsureMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageInsureMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageInsureMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageInsureWeekStat(req,res,next){
    var params = req.params ;
    damageInsureDAO.getDamageInsureWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageInsureWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageInsureWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createInsure : createInsure,
    createDamageInsure : createDamageInsure,
    queryDamageInsure : queryDamageInsure,
    updateDamageInsure : updateDamageInsure,
    updateDamageInsureStatus : updateDamageInsureStatus,
    queryDamageInsureMonthStat : queryDamageInsureMonthStat,
    queryDamageInsureWeekStat : queryDamageInsureWeekStat
}
