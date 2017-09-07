/**
 * Created by zwl on 2017/8/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteLoadTaskDetailDAO = require('../dao/DpRouteLoadTaskDetailDAO.js');
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

function updateDpRouteLoadTaskDetailStatus(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
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


module.exports = {
    createDpRouteLoadTaskDetail : createDpRouteLoadTaskDetail,
    queryDpRouteLoadTaskDetail : queryDpRouteLoadTaskDetail,
    updateDpRouteLoadTaskDetailStatus : updateDpRouteLoadTaskDetailStatus
}
