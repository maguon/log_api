/**
 * Created by zwl on 2017/4/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carStorageRelDAO = require('../dao/CarStorageRelDAO.js');
var carDAO = require('../dao/CarDAO.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var csv=require('csvtojson');
var fs = require('fs');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarStorageRel.js');

function createCarStorageRel(req,res,next){
    var params = req.params ;
    var parkObj = {};
    var carId = 0;
    var relId = 0;
    var myDate = new Date();
    Seq().seq(function(){
        var that = this;
        storageParkingDAO.getStorageParking(params,function(error,rows){
            if (error) {
                logger.error(' getStorageParking ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].car_id == 0){
                    parkObj.areaName = rows[0].area_name;
                    parkObj.row = rows[0].row;
                    parkObj.col = rows[0].col;
                    that();
                }else{
                    logger.warn(' getStorageParking ' + 'failed');
                    resUtil.resetFailedRes(res,"车位被占用，不为空 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
            carDAO.addCar(params,function(error,result){
                if (error) {
                    if(error.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "商品车数据已经存在，请核对后在入库");
                        return next();
                    } else{
                        logger.error(' createCar ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createCar ' + 'success');
                        carId = result.insertId;
                        req.params.carId = carId;
                        that();
                    }else{
                        resUtil.resetFailedRes(res," 创建商品车失败 ");
                        return next();
                    }
                }
            })
    }).seq(function(){
        var that = this;
        if(params.enterTime == null){
            params.enterTime = myDate;
        }
        var subParams ={
            carId : carId,
            storageId : params.storageId,
            storageName : params.storageName,
            enterTime : params.enterTime,
            planOutTime : params.planOutTime,
        }
        carStorageRelDAO.addCarStorageRel(subParams,function(err,result){
            if (err) {
                logger.error(' createCarStorageRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createCarStorageRel ' + 'success');
                    relId = result.insertId;
                }else{
                    logger.warn(' createCarStorageRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        var subParams ={
            carId : carId,
            relId : relId,
            parkingId : params.parkingId,
        }
        storageParkingDAO.updateStorageParking(subParams,function(err,result){
            if (err) {
                logger.error(' updateStorageParking ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageParking ' + 'success');
                }else{
                    logger.warn(' updateStorageParking ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createCarStorageRel ' + 'success');
        req.params.carContent =" 入库 "+req.params.storageName+ " 停放位置 " + parkObj.areaName + " " +parkObj.row+ " 排 "+parkObj.col+ " 列 ";
        req.params.op =11;
        resUtil.resetQueryRes(res,{carId:carId,relId:relId},null);
        return next();
    })
}

function createAgainCarStorageRel(req,res,next){
    var params = req.params ;
    var parkObj = {};
    var carId = 0;
    var relId = 0;
    var newCarFlag  = false;
    var myDate = new Date();
    Seq().seq(function(){
        var that = this;
        storageParkingDAO.getStorageParking(params,function(error,rows){
            if (error) {
                logger.error(' getStorageParking ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].car_id == 0){
                    parkObj.areaName = rows[0].area_name;
                    parkObj.row = rows[0].row;
                    parkObj.col = rows[0].col;
                    that();
                }else{
                    logger.warn(' getStorageParking ' + 'failed');
                    resUtil.resetFailedRes(res,"车位被占用，不为空");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var subParams ={
            carId : params.carId,
            vin : params.vin
        }
        carDAO.getCarBase(subParams,function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].rel_status == listOfValue.REL_STATUS_MOVE){
                    logger.warn(' getCarBase ' +params.vin+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else if(rows && rows.length>0&&rows[0].rel_status == listOfValue.REL_STATUS_OUT) {
                    carId = rows[0].id;
                    newCarFlag = true;
                    that();
                }else{
                    carId = rows[0].id;
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        if(params.enterTime == null){
            params.enterTime = myDate;
        }
        var subParams ={
            carId : carId,
            storageId : params.storageId,
            storageName : params.storageName,
            enterTime : params.enterTime,
            planOutTime : params.planOutTime,
        }
        carStorageRelDAO.addCarStorageRel(subParams,function(err,result){
            if (err) {
                logger.error(' createCarStorageRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createCarStorageRel ' + 'success');
                    relId = result.insertId;
                }else{
                    logger.warn(' createCarStorageRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        if(newCarFlag) {
            var subParams = {
                carId: carId,
                relId: relId,
            }
            carStorageRelDAO.updateRelActive(subParams, function (err, result) {
                if (err) {
                    logger.error(' updateRelActive ' + err.message);
                    throw sysError.InternalError(err.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateRelActive ' + 'success');
                    } else {
                        logger.warn(' updateRelActive ' + 'failed');
                    }
                    that();
                }
            })
        }else{
            that();
        }
    }).seq(function () {
        var that = this;
        var subParams ={
            carId : carId,
            relId : relId,
            parkingId : params.parkingId,
        }
        storageParkingDAO.updateStorageParking(subParams,function(err,result){
            if (err) {
                logger.error(' updateStorageParking ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageParking ' + 'success');
                }else{
                    logger.warn(' updateStorageParking ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        var params = req.params ;
        params.carStatus = listOfValue.CAR_STATUS_MOVE;
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
        logger.info(' createAgainCarStorageRel ' + 'success');
        req.params.carContent =" 入库 "+req.params.storageName+ " 停放位置 " + parkObj.areaName + " " +parkObj.row+ " 排 "+parkObj.col+ " 列 ";
        req.params.op =11;
        resUtil.resetQueryRes(res,{carId:carId,relId:relId},null);
        return next();
    })
}

function updateRelStatus(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        carDAO.getCarBase({carId:params.carId},function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0&&rows[0].rel_status == listOfValue.REL_STATUS_MOVE){
                    parkObj.parkingId = rows[0].p_id;
                    parkObj.storageId = rows[0].storage_id;
                    parkObj.storageName = rows[0].storage_name;
                    parkObj.row = rows[0].row;
                    parkObj.col = rows[0].col;
                    parkObj.carId = rows[0].id;
                    parkObj.vin = rows[0].vin;
                    that();
                }else{
                    logger.warn(' getCarBase ' + 'failed');
                    resUtil.resetFailedRes(res," 商品车已存在 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        carStorageRelDAO.updateRelStatus(params,function(error,result){
            if (error) {
                logger.error(' updateRelStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateRelStatus ' + 'success');
                }else{
                    logger.warn(' updateRelStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        carStorageRelDAO.getCarStorageRel(params,function(error,rows){
            if (error) {
                logger.error(' getCarStorageRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].rel_status == listOfValue.REL_STATUS_OUT){
                    that();
                }else{
                    logger.warn(' getCarStorageRel ' + 'failed');
                    resUtil.resetFailedRes(res,"商品车已入库 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        var subParams ={
            parkingId:parkObj.parkingId,
            storageId:parkObj.storageId,
            carId:parkObj.carId
        }
        storageParkingDAO.updateStorageParkingOut(subParams,function(error,result){
            if (error) {
                logger.error(' updateStorageParkingOut ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageParkingOut ' + 'success');
                }else{
                    logger.warn(' updateStorageParkingOut ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var params = req.params ;
        params.carStatus = listOfValue.CAR_STATUS_OUT;
        carDAO.updateCarStatus(params,function(error,result){
            if (error) {
                logger.error(' updateCarStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarStatus ' + 'success');
                req.params.carContent =" 从 "+parkObj.storageName+ " 出库 ";
                req.params.vin =parkObj.vin;
                req.params.op =13;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateRelPlanOutTime(req,res,next){
    var params = req.params ;
    carStorageRelDAO.updateRelPlanOutTime(params,function(error,result){
        if (error) {
            logger.error(' updateRelPlanOutTime ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateRelPlanOutTime ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function uploadCarExportsFile(req,res,next){
    var params = req.params;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                vin : objArray[i].vin,
                entrustId : objArray[i].entrustId,
                storageId : objArray[i].storageId,
                active : listOfValue.REL_STATUS_ACTIVE,
                row : i+1,
            }
            carDAO.getCar(subParams,function(error,rows){
                if (error) {
                    logger.error(' getCar ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else{
                    if(rows&&rows.length>0){
                        parkObj.carId = rows[0].id;
                        parkObj.entrustId = rows[0].entrust_id;
                        parkObj.carStatus = listOfValue.CAR_STATUS_OUT;
                        parkObj.relId = rows[0].r_id;
                        parkObj.relStatus = listOfValue.REL_STATUS_OUT;
                        parkObj.parkingId = rows[0].p_id;
                        parkObj.storageId = rows[0].storage_id;
                        console.log(parkObj)
                        carDAO.updateCarStatusBatch(parkObj,function(err,result){
                            if (err) {
                                logger.error(' updateCarStatusBatch ' + err.message);
                                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            } else {
                                if(result&&result.affectedRows>0){
                                    successedInsert = successedInsert+1;
                                    logger.info(' updateCarStatusBatch ' + 'success');
                                }else{
                                    logger.warn(' updateCarStatusBatch ' + 'failed');
                                }
                                that(null, i);
                            }
                        })
                        carStorageRelDAO.updateRelStatus(parkObj,function(error,result){
                            if (error) {
                                logger.error(' updateRelStatus ' + error.message);
                                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            } else {
                                if(result&&result.affectedRows>0){
                                    logger.info(' updateRelStatus ' + 'success');
                                }else{
                                    logger.warn(' updateRelStatus ' + 'failed');
                                }
                                that(null, i);
                            }
                        })
                        storageParkingDAO.updateStorageParkingOut(parkObj,function(error,result){
                            if (error) {
                                logger.error(' updateStorageParkingOut ' + error.message);
                                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            } else {
                                if(result&&result.affectedRows>0){
                                    logger.info(' updateStorageParkingOut ' + 'success');
                                }else{
                                    logger.warn(' updateStorageParkingOut ' + 'failed');
                                }
                                that(null, i);
                            }
                        })
                    }else{
                        logger.warn(' getCar ' + 'failed');
                        resUtil.resetFailedRes(res," 与系统数据不匹配,操作失败 ");
                        return next();
                    }
                }
            })

        }).seq(function(){
            console.log(successedInsert)
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadCarExportsFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}


module.exports = {
    createCarStorageRel : createCarStorageRel,
    createAgainCarStorageRel : createAgainCarStorageRel,
    updateRelStatus : updateRelStatus,
    updateRelPlanOutTime : updateRelPlanOutTime,
    uploadCarExportsFile : uploadCarExportsFile
}
