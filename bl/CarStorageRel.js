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
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarStorageRel.js');

function createCarStorageRel(req,res,next){
    var params = req.params ;
    var carId = 0;
    var myDate = new Date();
    Seq().seq(function(){
        var that = this;
        storageParkingDAO.getStorageParking(params,function(error,rows){
            if (error) {
                logger.error(' getStorageParking ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].car_id == 0){
                    that();
                }else{
                    logger.warn(' getStorageParking ' + 'failed');
                    resUtil.resetFailedRes(res,"parking is not empty");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        carDAO.getCarBase({vin:params.vin},function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getCarBase ' +params.vin+ sysMsg.CUST_SIGNUP_REGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.CUST_SIGNUP_REGISTERED);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        carDAO.addCar(params,function(error,result){
            if (error) {
                logger.error(' createCar ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createCar ' + 'success');
                    carId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create car failed");
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
        resUtil.resetCreateRes(res,{insertId:carId},null);
        return next();
    })
}

function updateRelStatus(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        carDAO.getCar(params,function(error,rows){
            if (error) {
                logger.error(' getCar ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length==1&&rows[0].rel_status == 1){
                    parkObj.parkingId = rows[0].p_id;
                    parkObj.storageId = rows[0].storage_id;
                    parkObj.carId = rows[0].id;
                    that();
                }else{
                    logger.warn(' getCar ' + 'failed');
                    resUtil.resetFailedRes(res,"car is not empty");
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
                if(rows&&rows.length==1&&rows[0].rel_status == 2){
                    that();
                }else{
                    logger.warn(' getCarStorageRel ' + 'failed');
                    resUtil.resetFailedRes(res,"carStorageRel is not empty");
                    return next();
                }
            }
        })
    }).seq(function () {
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
                logger.info(' updateStorageParkingOut ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createCarStorageRel : createCarStorageRel,
    updateRelStatus : updateRelStatus
}
