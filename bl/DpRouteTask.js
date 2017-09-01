/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteTaskDAO = require('../dao/DpRouteTaskDAO.js');
var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteTask.js');

function createDpRouteTask(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.addDpRouteTask(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteTask ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTask(req,res,next){
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
    dpRouteTaskDAO.getDpRouteTask(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTask ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveDistanceCount(req,res,next){
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
    dpRouteTaskDAO.getDriveDistanceCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveDistanceCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveDistanceCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskStatus(req,res,next){
    var params = req.params;
    Seq().seq(function() {
        var that = this;
        if (params.taskStatus == sysConst.TASK_STATUS.transport) {
            params.loadTaskStatus = sysConst.LOAD_TASK_STATUS.no_load;
            dpRouteLoadTaskDAO.getDpRouteLoadTaskBase(params, function (error, rows) {
                if (error) {
                    logger.error(' getDpRouteLoadTaskBase ' + error.message);
                    resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    if (rows && rows.length > 0) {
                        logger.warn(' getDpRouteLoadTaskBase ' + 'failed');
                        resUtil.resetFailedRes(res, " 未完成装车任务，状态不可为在途 ");
                        return next();
                    } else {
                        that();
                    }
                }
            })
        }else{
            that();
        }
    }).seq(function () {
        dpRouteTaskDAO.updateDpRouteTaskStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteTaskStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpRouteTaskStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function removeDpRouteTask(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDAO.getDpRouteLoadTask(params,function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    logger.warn(' getDpRouteLoadTask ' + 'failed');
                    resUtil.resetFailedRes(res," 请先删除该段路线任务，在删除路线。 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        params.taskStatus = sysConst.TASK_STATUS.cancel;
        dpRouteTaskDAO.updateDpRouteTaskStatus(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' removeDpRouteTask ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDpRouteTask : createDpRouteTask,
    queryDpRouteTask : queryDpRouteTask,
    queryDriveDistanceCount : queryDriveDistanceCount,
    updateDpRouteTaskStatus : updateDpRouteTaskStatus,
    removeDpRouteTask : removeDpRouteTask
}