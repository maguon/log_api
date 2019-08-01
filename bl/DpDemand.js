/**
 * Created by zwl on 2017/8/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var sysConst = require('../util/SysConst.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpDemandDAO = require('../dao/DpDemandDAO.js');
var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');
var cityRouteDAO = require('../dao/CityRouteDAO.js');
var baseAddrDAO = require('../dao/BaseAddrDAO.js');
var receiveDAO = require('../dao/ReceiveDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpDemand.js');

function createDpDemand(req,res,next){
    var params = req.params ;
    var dateId = params.dateId;
    var d = new Date(dateId);
    var currentDateStr = moment(d).format('YYYYMMDD');
    params.dateId = parseInt(currentDateStr);
    dpDemandDAO.addDpDemand(params,function(error,result){
        if (error) {
            logger.error(' createDpDemand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpDemand ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpDemand(req,res,next){
    var params = req.params ;
    if(params.dateIdStart !=null || params.dateIdStart !=""){
        var dateIdStart = params.dateIdStart;
        var d = new Date(dateIdStart);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdStart = parseInt(currentDateStr);
    }
    if(params.dateIdEnd !=null || params.dateIdEnd !=""){
        var dateIdEnd = params.dateIdEnd;
        var d = new Date(dateIdEnd);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdEnd = parseInt(currentDateStr);
    }
    dpDemandDAO.getDpDemand(params,function(error,result){
        if (error) {
            logger.error(' queryDpDemand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpDemand ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpDemandBase(req,res,next){
    var params = req.params ;
    dpDemandDAO.getDpDemandBase(params,function(error,result){
        if (error) {
            logger.error(' queryDpDemandBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpDemandBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryNotCompletedDpDemand(req,res,next){
    var params = req.params ;
    dpDemandDAO.getNotCompletedDpDemand(params,function(error,result){
        if (error) {
            logger.error(' queryNotCompletedDpDemand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryNotCompletedDpDemand ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpDemandStatus(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDAO.getDpRouteLoadTask({dpDemandId:params.dpDemandId},function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0&&params.demandStatus == sysConst.DEMAND_STATUS.cancel){
                    logger.warn(' getDpRouteLoadTask ' + 'failed');
                    resUtil.resetFailedRes(res," 需求已经指派了任务，请先取消任务 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        dpDemandDAO.updateDpDemandStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpDemandStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpDemandStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function createEntrustDpDemand(req,res,next){
    var params = req.params ;
    var demandObj = {};
    Seq().seq(function(){
        var that = this;
        var subParams ={
            routeStart : params.routeStart,
            routeEnd : params.routeEnd,
        }
        cityRouteDAO.getCityRouteId(subParams,function(error,rows){
            if (error) {
                logger.error(' getCityRouteCheck ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1){
                    if(rows[0].route_start==params.routeStart&&rows[0].route_end==params.routeEnd){
                        demandObj.routeStartId = rows[0].route_start_id;
                        demandObj.routeEndId = rows[0].route_end_id;
                    }else{
                        demandObj.routeStartId = rows[0].route_end_id;
                        demandObj.routeEndId = rows[0].route_start_id;
                    }

                    that();
                }else{
                    logger.warn(' getCityRouteCheck ' + 'failed');
                    resUtil.resetFailedRes(res," 路线不存在,请先设置路线 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        var subParams ={
            baseAddrId : params.baseAddrId,
        }
        baseAddrDAO.getBaseAddr(subParams,function(error,rows){
            if (error) {
                logger.error(' getBaseAddr ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1){
                    demandObj.addrName = rows[0].addr_name;
                    that();
                }else{
                    logger.warn(' getBaseAddr ' + 'failed');
                    resUtil.resetFailedRes(res," 发运地不存在,请先设置发运地 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        var subParams ={
            receiveId : params.receiveId,
        }
        receiveDAO.getReceive(subParams,function(error,rows){
            if (error) {
                logger.error(' getBaseAddr ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1){
                    demandObj.shortName = rows[0].short_name;
                    that();
                }else{
                    logger.warn(' getBaseAddr ' + 'failed');
                    resUtil.resetFailedRes(res," 经销商不存在,请先设置经销商 ");
                    return next();
                }
            }
        })

    }).seq(function () {
        params.routeStartId = demandObj.routeStartId;
        params.routeEndId = demandObj.routeEndId;
        params.addrName = demandObj.addrName;
        params.shortName = demandObj.shortName;
        dpDemandDAO.addEntrustDpDemand(params,function(error,result){
            if (error) {
                logger.error(' createEntrustDpDemand ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createEntrustDpDemand ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryEntrustDpDemand(req,res,next){
    var params = req.params ;
    if(params.dateIdStart !=null || params.dateIdStart !=""){
        var dateIdStart = params.dateIdStart;
        var d = new Date(dateIdStart);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdStart = parseInt(currentDateStr);
    }
    if(params.dateIdEnd !=null || params.dateIdEnd !=""){
        var dateIdEnd = params.dateIdEnd;
        var d = new Date(dateIdEnd);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdEnd = parseInt(currentDateStr);
    }
    dpDemandDAO.getEntrustDpDemand(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustDpDemand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustDpDemand ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateEntrustDpDemandStatus(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDAO.getDpRouteLoadTask({dpDemandId:params.dpDemandId},function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0&&params.demandStatus == sysConst.DEMAND_STATUS.cancel){
                    logger.warn(' getDpRouteLoadTask ' + 'failed');
                    resUtil.resetFailedRes(res," 需求已经指派了任务，请先取消任务 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        dpDemandDAO.updateEntrustDpDemandStatus(params,function(error,result){
            if (error) {
                logger.error(' updateEntrustDpDemandStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateEntrustDpDemandStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDpDemand : createDpDemand,
    queryDpDemand : queryDpDemand,
    queryDpDemandBase : queryDpDemandBase,
    queryNotCompletedDpDemand : queryNotCompletedDpDemand,
    updateDpDemandStatus : updateDpDemandStatus,
    createEntrustDpDemand : createEntrustDpDemand,
    queryEntrustDpDemand : queryEntrustDpDemand,
    updateEntrustDpDemandStatus : updateEntrustDpDemandStatus
}