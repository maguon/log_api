/**
 * Created by zwl on 2017/8/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpDemandDAO = require('../dao/DpDemandDAO.js');
var dpRouteTaskDAO = require('../dao/DpRouteTaskDAO.js');
var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');
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
    Seq().seq(function(){
        var that = this;
        dpRouteTaskDAO.getDpRouteTask({dpRouteTaskId:params.dpRouteTaskId},function(error,rows){
            if (error) {
                logger.error(' getDpRouteTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0 && params.routeEndId == rows[0].route_end_id){
                    that();
                }else{
                    logger.warn(' getDpRouteTask ' + 'failed');
                    resUtil.resetFailedRes(res," 送达城市不在规定路线内，需新建路线任务补全整条路线。 ");
                    return next();
                }
            }
        })
    }).seq(function () {
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
                if(rows&&rows.length>0){
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


module.exports = {
    createDpDemand : createDpDemand,
    queryDpDemand : queryDpDemand,
    queryDpDemandBase : queryDpDemandBase,
    updateDpDemandStatus : updateDpDemandStatus
}