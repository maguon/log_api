/**
 * Created by zwl on 2018/2/2.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckAccidentDAO = require('../dao/TruckAccidentDAO.js');
var truckAccidentCheckDAO = require('../dao/TruckAccidentCheckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckAccident.js');

function createTruckAccident(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    truckAccidentDAO.addTruckAccident(params,function(error,result){
        if (error) {
            logger.error(' createTruckAccident ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruckAccident ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccident(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccident(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccident ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccident ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccident(req,res,next){
    var params = req.params ;
    truckAccidentDAO.updateTruckAccident(params,function(error,result){
        if (error) {
            logger.error(' updateTruckAccident ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckAccident ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccidentStatus(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        truckAccidentDAO.updateTruckAccidentStatus(params,function(error,result){
            if (error) {
                logger.error(' updateTruckAccidentStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckAccidentStatus ' + 'success');
                    that();
                }else{
                    logger.warn(' updateTruckAccidentStatus ' + 'failed');
                    resUtil.resetFailedRes(res," 事故处理完成失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.endDate = myDate;
        truckAccidentCheckDAO.updateTruckAccidentCheckFinishTime(params,function(error,result){
            if (error) {
                logger.error(' updateTruckAccidentCheckFinishTime ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckAccidentCheckFinishTime ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryTruckAccidentNotCheckCount(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccidentNotCheckCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentNotCheckCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentNotCheckCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentTotalCost(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccidentTotalCost(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentTotalCost ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentTotalCost ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentTypeMonthStat(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccidentTypeMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentTypeMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentTypeMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentCostMonthStat(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccidentCostMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentCostMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentCostMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckAccident : createTruckAccident,
    queryTruckAccident : queryTruckAccident,
    updateTruckAccident : updateTruckAccident,
    updateTruckAccidentStatus : updateTruckAccidentStatus,
    queryTruckAccidentNotCheckCount : queryTruckAccidentNotCheckCount,
    queryTruckAccidentTotalCost : queryTruckAccidentTotalCost,
    queryTruckAccidentTypeMonthStat : queryTruckAccidentTypeMonthStat,
    queryTruckAccidentCostMonthStat : queryTruckAccidentCostMonthStat
}