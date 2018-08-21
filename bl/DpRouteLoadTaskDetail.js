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
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDetail.js');

function createDpRouteLoadTaskDetail(req,res,next){
    var params = req.params ;
    var parkObj = {};
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
                    parkObj.routeStartName = rows[0].route_start_name;
                    parkObj.baseAddrName = rows[0].base_addr_name;
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
        carDAO.getCarList({carId:params.carId},function(error,rows){
            if (error) {
                logger.error(' getCarList ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].car_status <listOfValue.CAR_STATUS_LOAD){
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
        truckDispatchDAO.updateTruckDispatchCarCount(params,function(error,result){
            if (error) {
                logger.error(' updateTruckDispatchCarCount ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckDispatchCarCount ' + 'success');
                }else{
                    logger.warn(' updateTruckDispatchCarCount ' + 'failed');
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
        req.params.carContent = parkObj.routeStartName+" "+parkObj.baseAddrName+" 完成装车  调度编号 "+params.dpRouteTaskId;
        req.params.vin =params.vin;
        req.params.op =sysConst.CAR_OP_TYPE.LOAD;
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

function queryDpRouteLoadTaskDetailBase(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetailBase(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskDetailBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskDetailBase ' + 'success');
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
    var parkObj = {};
    Seq().seq(function() {
        var that = this;
        dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetail({dpRouteTaskDetailId:params.dpRouteTaskDetailId}, function (error, rows) {
            if (error) {
                logger.error(' getDpRouteLoadTaskDetail ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows && rows.length > 0) {
                    parkObj.carId = rows[0].car_id;
                    parkObj.vin = rows[0].vin;
                    parkObj.routeEndId = rows[0].route_end_id;
                    parkObj.routeEndName = rows[0].route_end_name;
                    parkObj.receiveName = rows[0].receive_name;
                    parkObj.transferFlag = rows[0].transfer_flag;
                    parkObj.transferCityId = rows[0].transfer_city_id;
                    parkObj.transferCityName = rows[0].transfer_city_name;
                    parkObj.transferAddrName = rows[0].transfer_addr_name;
                    that();
                } else {
                    logger.warn(' getDpRouteLoadTaskDetail ' + 'failed');
                    resUtil.resetFailedRes(res, " 数据不存在，或已取消装车 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
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
        var that = this;
        if(parkObj.transferFlag==1){
            params.carStatus = listOfValue.CAR_STATUS_TRANSFER;
            params.carId = parkObj.carId;
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
        }else{
            that();
        }

    }).seq(function () {
        var that = this;
        if(parkObj.transferFlag==1){
            params.currentCity = parkObj.transferCityName;
        }else{
            params.currentCity = parkObj.routeEndName;
        }
        params.carId = parkObj.carId;
        carDAO.updateCaCurrentCity(params,function(error,result){
            if (error) {
                logger.error(' updateCaCurrentCity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCaCurrentCity ' + 'success');
                }else{
                    logger.warn(' updateCaCurrentCity ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        truckDispatchDAO.updateTruckDispatchCarCount(params,function(error,result){
            if (error) {
                logger.error(' updateTruckDispatchCarCount ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckDispatchCarCount ' + 'success');
                if(parkObj.transferFlag==1){
                    req.params.carContent =" 送达 中转站 "+parkObj.transferCityName+" "+parkObj.transferAddrName;
                    req.params.carId =parkObj.carId;
                    req.params.vin =parkObj.vin;
                    req.params.op =sysConst.CAR_OP_TYPE.ARRIVED;
                }else{
                    req.params.carContent =" 送达 经销商 "+parkObj.routeEndName+" "+parkObj.receiveName;
                    req.params.carId =parkObj.carId;
                    req.params.vin =parkObj.vin;
                    req.params.op =sysConst.CAR_OP_TYPE.ARRIVED;
                }

                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function removeDpRouteLoadTaskDetail(req,res,next){
    var params = req.params;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetail({dpRouteTaskDetailId:params.dpRouteTaskDetailId},function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTaskDetail ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].load_task_status ==sysConst.LOAD_TASK_STATUS.no_load){
                    parkObj.vin = rows[0].vin;
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
                    that();
                }else{
                    logger.warn(' removeDpRouteLoadTaskDetail ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.carLoadStatus = sysConst.CAR_LOAD_STATUS.arrive;
        truckDispatchDAO.updateTruckDispatchCarCount(params,function(error,result){
            if (error) {
                logger.error(' updateTruckDispatchCarCount ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckDispatchCarCount ' + 'success');
                }else{
                    logger.warn(' updateTruckDispatchCarCount ' + 'failed');
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
                req.params.carContent =" 取消装车 ";
                req.params.vin =parkObj.vin;
                req.params.op =sysConst.RECORD_OP_TYPE.cancel;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDpRouteLoadTaskDetail : createDpRouteLoadTaskDetail,
    queryDpRouteLoadTaskDetail : queryDpRouteLoadTaskDetail,
    queryDpRouteLoadTaskDetailBase : queryDpRouteLoadTaskDetailBase,
    queryCarLoadStatusCount : queryCarLoadStatusCount,
    updateDpRouteLoadTaskDetailStatus : updateDpRouteLoadTaskDetailStatus,
    removeDpRouteLoadTaskDetail : removeDpRouteLoadTaskDetail
}
