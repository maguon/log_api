/**
 * Created by zwl on 2018/6/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var settleHandoverCarRelDAO = require('../dao/SettleHandoverCarRelDAO.js');
var settleHandoverDAO = require('../dao/SettleHandoverDAO.js');
var dpRouteLoadTaskDetailDAO = require('../dao/DpRouteLoadTaskDetailDAO.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverCarRel.js');
var csv=require('csvtojson');
var fs = require('fs');

function createSettleHandoverCarRel(req,res,next){
    var params = req.params ;
    var settleHandoverId = 0;
    var routeStartId = 0;
    var routeEndId =0;
    var parkObj = {};
    var newRouteFlag  = false;
    Seq().seq(function(){
        var that = this;
        settleHandoverDAO.getSettleHandover({settleHandoverId:params.settleHandoverId},function(error,rows){
            if (error) {
                logger.error(' getSettleHandover ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length<=0){
                    logger.warn(' getSettleHandover ' + 'failed');
                    resUtil.resetFailedRes(res," 交接单编号不存在 ");
                    return next();
                }else if(rows&&rows.length>0&&rows[0].route_start_id >0&&rows[0].route_end_id >0){
                    routeStartId = rows[0].route_start_id;
                    routeEndId = rows[0].route_end_id;
                    that();
                }else{
                    newRouteFlag = true;
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        if(newRouteFlag){
            dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetailBase({carId:params.carId},function(error,rows){
                if (error) {
                    logger.error(' getDpRouteLoadTaskDetailBase ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else{
                    if(rows&&rows.length>0){
                        parkObj.routeStartId = rows[0].route_start_id;
                        parkObj.routeEndId = rows[0].route_end_id;
                        parkObj.receiveId = rows[0].receive_id;
                        that();
                    }else{
                        logger.warn(' getDpRouteLoadTaskDetailBase ' + 'failed');
                        resUtil.resetFailedRes(res," 到达路线不存在 ");
                        return next();
                    }
                }
            })
        }else{
            dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetailBase({carId:params.carId},function(error,rows){
                if (error) {
                    logger.error(' getDpRouteLoadTaskDetailBase ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else{
                    if(rows&&rows.length>0&&rows[0].route_start_id==routeStartId&&rows[0].route_end_id==routeEndId){
                        parkObj.vin = rows[0].vin;
                        that();
                    }else{
                        logger.warn(' getDpRouteLoadTaskDetailBase ' + 'failed');
                        resUtil.resetFailedRes(res," 该车辆路线与之前路线不符合 ");
                        return next();
                    }
                }
            })
        }

    }).seq(function(){
        var that = this;
        settleHandoverCarRelDAO.addSettleHandoverCarRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createSettleHandoverCarRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    settleHandoverId = result.insertId;
                    logger.info(' createSettleHandoverCarRel ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create settleHandoverCarRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        settleHandoverDAO.updateCarCountPlus(params,function(error,result){
            if (error) {
                logger.error(' updateCarCountPlus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCarCountPlus ' + 'success');
                }else{
                    logger.warn(' updateCarCountPlus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        if(newRouteFlag) {
            var subParams = {
                routeStartId : parkObj.routeStartId,
                routeEndId : parkObj.routeEndId,
                receiveId : parkObj.receiveId,
                settleHandoverId : params.settleHandoverId,
            }
            settleHandoverDAO.updateSettleHandoverRoute(subParams, function (err, result) {
                if (err) {
                    logger.error(' updateSettleHandoverRoute ' + err.message);
                    throw sysError.InternalError(err.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateSettleHandoverRoute ' + 'success');
                    } else {
                        logger.warn(' updateSettleHandoverRoute ' + 'failed');
                    }
                    that();
                }
            })
        }else{
            that();
        }
    }).seq(function(){
        logger.info(' createSettleHandoverCarRel ' + 'success');
        req.params.carContent =" 生成交接单 ";
        req.params.vin =parkObj.vin;
        req.params.op =sysConst.CAR_OP_TYPE.SETTLE_HANDOVER;
        resUtil.resetCreateRes(res,{insertId:settleHandoverId},null);
        return next();
    })
}

function querySettleHandoverCarRel(req,res,next){
    var params = req.params ;
    settleHandoverCarRelDAO.getSettleHandoverCarRel(params,function(error,result){
        if (error) {
            logger.error(' querySettleHandoverCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleHandoverCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeSettleHandoverCarRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        settleHandoverCarRelDAO.deleteSettleHandoverCarRel(params,function(error,result){
            if (error) {
                logger.error(' removeSettleHandoverCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeSettleHandoverCarRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeSettleHandoverCarRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        settleHandoverDAO.updateCarCountMinus(params,function(error,result){
            if (error) {
                logger.error(' updateCarCountMinus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarCountMinus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function uploadSettleHandoverCarRelFile(req,res,next){
    var params = req.params;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            Seq().seq(function(){
                var that = this;
                var subParams ={
                    vin : objArray[i].VIN,
                    entrustId : objArray[i].委托方ID,
                    routeStartId : objArray[i].起始城市ID,
                    addrId : objArray[i].发运地址ID,
                    routeEndId : objArray[i].目的地ID,
                    receiveId : objArray[i].经销商ID,
                    carStatus : sysConst.CAR_STATUS.completed,
                    row : i+1,
                };
                parkObj.sequenceNum = objArray[i].序列号;
                carDAO.getCarList(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getCarList ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.carId = rows[0].id;
                        }else{
                            parkObj.carId = 0;
                        }

                        that();
                    }
                })
            }).seq(function(){
                if(parkObj.carId>0){
                    var subParams = {
                        settleHandoverId : 0,
                        carId: parkObj.carId,
                        sequenceNum: parkObj.sequenceNum,
                        row: i + 1
                    }
                    settleHandoverCarRelDAO.addSettleHandoverCarRel(subParams, function (err, result) {
                        if (err) {
                            logger.error(' uploadSettleHandoverCarRelFile ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null, i);
                        } else {
                            if (result && result.insertId > 0) {
                                successedInsert = successedInsert + result.affectedRows;
                                logger.info(' uploadSettleHandoverCarRelFile ' + 'success');
                            } else {
                                logger.warn(' uploadSettleHandoverCarRelFile ' + 'failed');
                            }
                            that(null, i);
                        }
                    })
                }else{
                    that(null,i);
                }

            })

        }).seq(function(){
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadSettleHandoverCarRelFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}


module.exports = {
    createSettleHandoverCarRel : createSettleHandoverCarRel,
    querySettleHandoverCarRel : querySettleHandoverCarRel,
    removeSettleHandoverCarRel : removeSettleHandoverCarRel,
    uploadSettleHandoverCarRelFile : uploadSettleHandoverCarRelFile
}

