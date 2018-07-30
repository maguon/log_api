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
var dpRouteLoadTaskDetailDAO = require('../dao/DpRouteLoadTaskDetailDAO.js');
var truckDispatchDAO = require('../dao/TruckDispatchDAO.js');
var dpRouteTaskLoanRelDAO = require('../dao/DpRouteTaskLoanRelDAO.js');
var dpRouteTaskRelDAO = require('../dao/DpRouteTaskRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteTask.js');

function createDpRouteTask(req,res,next){
    var params = req.params ;
    var dpRouteTaskId = 0;
    Seq().seq(function(){
        var that = this;
        dpRouteTaskDAO.addDpRouteTask(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTask ' + 'success');
                    dpRouteTaskId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create dpRouteTask failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.dpRouteTaskId = dpRouteTaskId;
        dpRouteTaskRelDAO.addDpRouteTaskRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "调度编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDpRouteTaskRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTaskRel ' + 'success');
                }else{
                    logger.warn(' createDpRouteTaskRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDpRouteTask ' + 'success');
        req.params.routeContent =" 生成路线 ";
        req.params.routeId = dpRouteTaskId;
        req.params.routeOp =sysConst.RECORD_OP_TYPE.create;
        resUtil.resetCreateRes(res,{insertId:dpRouteTaskId},null);
        return next();
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

function queryNotCompletedTaskStatusCount(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getNotCompletedTaskStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryNotCompletedTaskStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryNotCompletedTaskStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskBase(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getDpRouteTaskBase(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTaskStatusCount(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getTaskStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryTaskStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTaskStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskStatus(req,res,next){
    var params = req.params;
    var parkObj = {};
    var carCount = 0;
    var newCompletedFlag  = false;
    Seq().seq(function() {
        var that = this;
        dpRouteTaskDAO.getDpRouteTask({dpRouteTaskId:params.dpRouteTaskId}, function (error, rows) {
                if (error) {
                    logger.error(' getDpRouteTask ' + error.message);
                    resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    if (rows && rows.length > 0) {
                        parkObj.routeStartId=rows[0].route_start_id;
                        parkObj.routeEndId=rows[0].route_end_id;
                        parkObj.truckId=rows[0].truck_id;
                        that();
                    } else {
                        logger.warn(' getDpRouteTask ' + 'failed');
                        resUtil.resetFailedRes(res, " 指令路线已被删除 ");
                        return next();
                    }
                }
            })
    }).seq(function() {
        var that = this;
        if (params.taskStatus == sysConst.TASK_STATUS.on_road) {
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
        }else if (params.taskStatus == sysConst.TASK_STATUS.completed) {
            /*params.loadTaskStatus = sysConst.LOAD_TASK_STATUS.load;
            dpRouteLoadTaskDAO.getDpRouteLoadTaskBase(params, function (error, rows) {
                if (error) {
                    logger.error(' getDpRouteLoadTaskBase ' + error.message);
                    resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    if (rows && rows.length > 0) {
                        logger.warn(' getDpRouteLoadTaskBase ' + 'failed');
                        resUtil.resetFailedRes(res, " 未全部送达，状态不可为完成 ");
                        return next();
                    } else {
                        newCompletedFlag = true;
                        that();
                    }
                }
            })*/
            newCompletedFlag = true;
            that();
        }else{
            that();
        }
    }).seq(function () {
        var that = this;
        if(newCompletedFlag) {
            dpRouteLoadTaskDetailDAO.getCarLoadStatusCount({dpRouteTaskId:params.dpRouteTaskId},function(error,rows){
                if (error) {
                    logger.error(' getCarLoadStatusCount ' + error.message);
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    carCount=rows[0].arrive_count;
                    that();
                }
            })
        }else{
            that();
        }
    }).seq(function () {
        var that = this;
        if(newCompletedFlag) {
            params.carCount = carCount;
            dpRouteTaskDAO.updateDpRouteTaskCarCount(params, function (error, result) {
                if (error) {
                    logger.error(' updateDpRouteTaskCarCount ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateDpRouteTaskCarCount ' + 'success');
                    } else {
                        logger.warn(' updateDpRouteTaskCarCount ' + 'failed');
                    }
                    that();
                }
            })
        }else{
            that();
        }
    }).seq(function() {
        var that = this;
        if (params.taskStatus == sysConst.TASK_STATUS.on_road) {
            var subParams ={
                currentCity:0,
                taskStart:parkObj.routeStartId,
                taskEnd:parkObj.routeEndId,
                truckId:parkObj.truckId
            }
            truckDispatchDAO.updateTruckDispatch(subParams, function (error, result) {
                if (error) {
                    logger.error(' updateTruckDispatch ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateTruckDispatch ' + 'success');
                    } else {
                        logger.warn(' updateTruckDispatch ' + 'failed');
                    }
                    that();
                }
            })
        }else if (params.taskStatus == sysConst.TASK_STATUS.completed) {
            var subParams ={
                currentCity:parkObj.routeEndId,
                taskStart:0,
                taskEnd:0,
                truckId:parkObj.truckId
            }
            truckDispatchDAO.updateTruckDispatch(subParams, function (error, result) {
                if (error) {
                    logger.error(' updateTruckDispatch ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateTruckDispatch ' + 'success');
                    } else {
                        logger.warn(' updateTruckDispatch ' + 'failed');
                    }
                    that();
                }
            });
        }else{
            that();
        }
    }).seq(function () {
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        if(params.taskStatus == sysConst.TASK_STATUS.doing){
            params.taskStartDate = myDate;
        }
        if(params.taskStatus == sysConst.TASK_STATUS.completed){
            params.taskEndDate = myDate;
            params.dateId = parseInt(strDate);
        }
        dpRouteTaskDAO.updateDpRouteTaskStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteTaskStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpRouteTaskStatus ' + 'success');
                if(params.taskStatus==sysConst.TASK_STATUS.accept){
                    req.params.routeContent =" 接受指令 ";
                    req.params.routeId = params.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.accept;
                }
                if(params.taskStatus==sysConst.TASK_STATUS.doing){
                    req.params.routeContent =" 执行指令 ";
                    req.params.routeId = params.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.doing;
                }
                if(params.taskStatus==sysConst.TASK_STATUS.on_road){
                    req.params.routeContent =" 装车完成，货车在途 ";
                    req.params.routeId = params.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.on_road;
                }
                if(params.taskStatus==sysConst.TASK_STATUS.completed){
                    req.params.routeContent =" 全部送达，任务完成 ";
                    req.params.routeId = params.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.completed;
                    dpRouteTaskDAO.finishDpRouteTask(params, function (error, result) {
                        if (error) {
                            logger.error(' updateTruckDispatch ' + error.message);
                            throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                        } else {
                            if (result && result.affectedRows > 0) {
                                logger.info(' updateTruckDispatch ' + 'success');
                            } else {
                                logger.warn(' updateTruckDispatch ' + 'failed');
                            }
                        }
                    });
                }


                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });

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
    }).seq(function(){
        var that = this;
        dpRouteTaskLoanRelDAO.deleteDpRouteTaskLoanRelAll(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTaskLoanRelAll ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDpRouteTaskLoanRelAll ' + 'success');
                }else{
                    logger.warn(' removeDpRouteTaskLoanRelAll ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        dpRouteTaskRelDAO.deleteDpRouteTaskRel(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTaskRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDpRouteTaskRel ' + 'success');
                }else{
                    logger.warn(' removeDpRouteTaskRel ' + 'failed');
                }
                that();
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
                req.params.routeContent =" 取消路线 ";
                req.params.routeId = params.dpRouteTaskId;
                req.params.routeOp =sysConst.RECORD_OP_TYPE.cancel;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


function queryRouteTaskWeekStat(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getRouteTaskWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryRouteTaskWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRouteTaskWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryRouteTaskMonthStat(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getRouteTaskMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryRouteTaskMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRouteTaskMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryRouteTaskDayStat(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getRouteTaskDayStat(params,function(error,result){
        if (error) {
            logger.error(' queryRouteTaskDayStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRouteTaskDayStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteTask : createDpRouteTask,
    queryDpRouteTask : queryDpRouteTask,
    queryDpRouteTaskBase : queryDpRouteTaskBase,
    queryDriveDistanceCount : queryDriveDistanceCount,
    queryNotCompletedTaskStatusCount : queryNotCompletedTaskStatusCount,
    queryTaskStatusCount : queryTaskStatusCount,
    updateDpRouteTaskStatus : updateDpRouteTaskStatus,
    removeDpRouteTask : removeDpRouteTask ,
    queryRouteTaskDayStat : queryRouteTaskDayStat ,
    queryRouteTaskWeekStat : queryRouteTaskWeekStat ,
    queryRouteTaskMonthStat : queryRouteTaskMonthStat
}