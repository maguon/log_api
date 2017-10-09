/**
 * Created by zwl on 2017/8/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');
var dpRouteLoadTaskDetailDAO = require('../dao/DpRouteLoadTaskDetailDAO.js');
var dpDemandDAO = require('../dao/DpDemandDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTask.js');

function createDpRouteLoadTask(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDAO.getDpRouteLoadTaskBase(params,function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTaskBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0&&rows[0].task_status ==sysConst.TASK_STATUS.on_road){
                    logger.warn(' getDpRouteLoadTaskBase ' + 'failed');
                    resUtil.resetFailedRes(res," 指令状态为在途，不能新增任务。 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        dpDemandDAO.getDpDemandBase({dpDemandId:params.dpDemandId},function(error,rows){
            if (error) {
                logger.error(' getDpDemandBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    if(params.planCount > rows[0].pre_count){
                        logger.warn(' getDpDemandBase ' + 'failed');
                        resUtil.resetFailedRes(res," 派发数量不能大于指令数量 ");
                        return next();
                    }else{
                        that();
                    }
                }else{
                    logger.warn(' getDpDemandBase ' + 'failed');
                    resUtil.resetFailedRes(res," 派发任务与调度需求不符合 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        dpRouteLoadTaskDAO.addDpRouteLoadTask(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteLoadTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createDpRouteLoadTask ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDpRouteLoadTask(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskDAO.getDpRouteLoadTask(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTask ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteLoadTaskStatus(req,res,next){
    var params = req.params;
    var parkObj = {};
    Seq().seq(function() {
        var that = this;
            dpRouteLoadTaskDAO.getDpRouteLoadTask({dpRouteLoadTaskId:params.dpRouteLoadTaskId}, function (error, rows) {
                if (error) {
                    logger.error(' getDpRouteLoadTask ' + error.message);
                    resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    if (rows && rows.length > 0) {
                        parkObj.cityName = rows[0].city_name;
                        parkObj.shortName = rows[0].short_name;
                        parkObj.carCount = rows[0].car_count;
                        parkObj.carExceptionCount = rows[0].car_exception_count;
                        parkObj.truckNum = rows[0].truck_num;
                        parkObj.dpRouteTaskId = rows[0].dp_route_task_id;
                        that();
                    } else {
                        logger.warn(' getDpRouteLoadTask ' + 'failed');
                        resUtil.resetFailedRes(res, " 任务不存在 ");
                        return next();
                    }
                }
            })
    }).seq(function () {
        dpRouteLoadTaskDAO.updateDpRouteLoadTaskStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteLoadTaskStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpRouteLoadTaskStatus ' + 'success');
                if(params.loadTaskStatus==sysConst.LOAD_TASK_STATUS.load){
                    req.params.routeContent =" 从 " + parkObj.cityName + " 到 " + parkObj.shortName + " 已完成装车   装车数量：" + parkObj.carCount ;
                    req.params.routeId = parkObj.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.on_road;
                }
                if(params.loadTaskStatus==sysConst.LOAD_TASK_STATUS.arrive){
                    req.params.routeContent =" 运输货车 "+ parkObj.truckNum +" 已到达 " + parkObj.shortName + "   卸车数量：" + parkObj.carCount + "   异常车辆：" + parkObj.carExceptionCount;
                    req.params.routeId = parkObj.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.completed;
                }
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function removeDpRouteLoadTask(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDAO.getDpRouteLoadTaskBase(params,function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTaskBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0&&rows[0].load_task_status ==sysConst.LOAD_TASK_STATUS.no_load){
                    that();
                }else{
                    logger.warn(' getDpRouteLoadTaskBase ' + 'failed');
                    resUtil.resetFailedRes(res," 该任务不是未装车状态，不能删除。 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetail(params,function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTaskDetail ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    logger.warn(' getDpRouteLoadTaskBase ' + 'failed');
                    resUtil.resetFailedRes(res," 该任务已经装有商品车，不能删除。 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        params.loadTaskStatus = sysConst.LOAD_TASK_STATUS.cancel;
        dpRouteLoadTaskDAO.updateDpRouteLoadTaskStatus(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteLoadTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' removeDpRouteLoadTask ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDpRouteLoadTask : createDpRouteLoadTask,
    queryDpRouteLoadTask : queryDpRouteLoadTask,
    updateDpRouteLoadTaskStatus : updateDpRouteLoadTaskStatus,
    removeDpRouteLoadTask : removeDpRouteLoadTask
}
