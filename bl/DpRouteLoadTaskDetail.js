/**
 * Created by zwl on 2017/8/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteLoadTaskDetailDAO = require('../dao/DpRouteLoadTaskDetailDAO.js');
var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');
var truckDispatchDAO = require('../dao/TruckDispatchDAO.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDetail.js');

function createDpRouteLoadTaskDetail(req,res,next){
    var params = req.params ;
    var dpRouteTaskDetailId = 0;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDAO.getDpRouteLoadTaskBase({dpRouteLoadTaskId:params.dpRouteLoadTaskId},function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTaskBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].load_task_status ==sysConst.LOAD_TASK_STATUS.no_load){
                    that();
                }else{
                    logger.warn(' getDpRouteLoadTaskBase ' +' failed ');
                    resUtil.resetFailedRes(res,' 任务不是待装车状态，不能进行装车 ');
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        carDAO.getCarList({vin:params.vin},function(error,rows){
            if (error) {
                logger.error(' getCarList ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].car_status ==listOfValue.CAR_STATUS_MOVE){
                    that();
                }else{
                    logger.warn(' getCarList ' +' failed ');
                    resUtil.resetFailedRes(res,' 商品车不是待装车状态，不能进行装车 ');
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        dpRouteLoadTaskDetailDAO.addDpRouteLoadTaskDetail(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteLoadTaskDetail ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteLoadTaskDetail ' + 'success');
                    dpRouteTaskDetailId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createDpRouteLoadTaskDetail failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        truckDispatchDAO.updateTruckDispatch(params,function(error,result){
            if (error) {
                logger.error(' updateTruckDispatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckDispatch ' + 'success');
                }else{
                    logger.warn(' updateTruckDispatch ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.carStatus = listOfValue.CAR_STATUS_LOAD;
        carDAO.updateCarStatus(params,function(error,result){
            if (error) {
                logger.error(' updateCarStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCarStatus ' + 'success');
                }else{
                    logger.warn(' updateCarStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDpRouteLoadTaskDetail ' + 'success');
        resUtil.resetCreateRes(res,{insertId:dpRouteTaskDetailId},null);
        return next();
    })
}

function queryDpRouteLoadTaskDetail(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetail(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskDetail ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskDetail ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarLoadStatusCount(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskDetailDAO.getCarLoadStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryCarLoadStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarLoadStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteLoadTaskDetailStatus(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
        var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
        var strDate = year + month + day;
        params.dateId = parseInt(strDate);
        params.arriveDate = myDate;
        dpRouteLoadTaskDetailDAO.updateDpRouteLoadTaskDetailStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteLoadTaskDetailStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDpRouteLoadTaskDetailStatus ' + 'success');
                }else{
                    logger.warn(' updateDpRouteLoadTaskDetailStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        truckDispatchDAO.updateTruckDispatch(params,function(error,result){
            if (error) {
                logger.error(' updateTruckDispatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckDispatch ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function removeDpRouteLoadTaskDetail(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetail({dpRouteTaskDetailId:params.dpRouteTaskDetailId},function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTaskDetail ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].load_task_status ==sysConst.LOAD_TASK_STATUS.no_load){
                    that();
                }else{
                    logger.warn(' getDpRouteLoadTaskDetail ' +' failed ');
                    resUtil.resetFailedRes(res,' 任务不是待装车状态，不能进行删除操作 ');
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        dpRouteLoadTaskDetailDAO.deleteDpRouteLoadTaskDetail(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteLoadTaskDetail ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDpRouteLoadTaskDetail ' + 'success');
                }else{
                    logger.warn(' removeDpRouteLoadTaskDetail ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.carLoadStatus = sysConst.CAR_LOAD_STATUS.arrive;
        truckDispatchDAO.updateTruckDispatch(params,function(error,result){
            if (error) {
                logger.error(' updateTruckDispatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckDispatch ' + 'success');
                }else{
                    logger.warn(' updateTruckDispatch ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        params.carStatus = listOfValue.CAR_STATUS_MOVE;
        carDAO.updateCarStatus(params,function(error,result){
            if (error) {
                logger.error(' updateCarStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDpRouteLoadTaskDetail : createDpRouteLoadTaskDetail,
    queryDpRouteLoadTaskDetail : queryDpRouteLoadTaskDetail,
    queryCarLoadStatusCount : queryCarLoadStatusCount,
    updateDpRouteLoadTaskDetailStatus : updateDpRouteLoadTaskDetailStatus,
    removeDpRouteLoadTaskDetail : removeDpRouteLoadTaskDetail
}
