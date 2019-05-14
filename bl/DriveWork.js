/**
 * Created by zwl on 2019/5/10.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveWorkDAO = require('../dao/DriveWorkDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveWork.js');
var csv=require('csvtojson');
var fs = require('fs');

function createDriveWork(req,res,next){
    var params = req.params ;
    var driveFlag  = true;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        driveWorkDAO.getDriveWork(params,function(error,rows){
            if (error) {
                logger.error(' getDriveWork ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    parkObj.id = rows[0].id;
                    driveFlag = false;
                }else{
                    driveFlag = true;
                }
                that();
            }
        })
    }).seq(function(){
        if(driveFlag){
            driveWorkDAO.addDriveWork(params,function(error,result){
                if (error) {
                    logger.error(' createDriveWork ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' createDriveWork ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        }else{
            driveWorkDAO.updateDriveWork(params,function(error,result){
                if (error) {
                    logger.error(' updateDriveWork ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' updateDriveWork ' + 'success');
                    resUtil.resetQueryRes(res,{id:parkObj.id},null);
                    return next();
                }
            })
        }
    })
}

function uploadDriveWorkFile(req,res,next){
    var params = req.params;
    var driveFlag  = true;
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
                    driveName : objArray[i].司机姓名,
                    mobile : objArray[i].电话,
                    row : i+1,
                }
                driveDAO.getDrive(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getDrive ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.driveId = rows[0].id;
                        }else{
                            parkObj.driveId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    truckNum : objArray[i].货车牌号,
                    row : i+1,
                }
                truckDAO.getTruckBase(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getTruckBase ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.truckId = rows[0].id;
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    driveId : parkObj.driveId,
                    truckId : parkObj.truckId,
                    mobile : objArray[i].电话,
                    yMonth : objArray[i].月份,
                    row : i+1,
                }
                driveWorkDAO.getDriveWork(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getDriveWork ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1){
                            driveFlag = false;
                        }else{
                            driveFlag = true;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(parkObj.driveId>0){
                    if(driveFlag){
                        var subParams ={
                            driveId : parkObj.driveId,
                            driveName : objArray[i].司机姓名,
                            truckId : parkObj.truckId,
                            truckNum : objArray[i].货车牌号,
                            mobile : objArray[i].电话,
                            yMonth : objArray[i].月份,
                            workCount : objArray[i].出勤天数,
                            hotelFee : objArray[i].住宿费,
                            row : i+1
                        }
                        driveWorkDAO.addDriveWork(subParams,function(err,result){
                            if (err) {
                                logger.error(' createUploadDriveWork ' + err.message);
                                //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                                that(null,i);
                            } else {
                                if(result&&result.insertId>0){
                                    successedInsert = successedInsert+result.affectedRows;
                                    logger.info(' createUploadDriveWork ' + 'success');
                                }else{
                                    logger.warn(' createUploadDriveWork ' + 'failed');
                                }
                                that(null,i);
                            }
                        })
                    }else{
                        var subParams ={
                            driveId : parkObj.driveId,
                            truckId : parkObj.truckId,
                            mobile : objArray[i].电话,
                            yMonth : objArray[i].月份,
                            workCount : objArray[i].出勤天数,
                            hotelFee : objArray[i].住宿费,
                            row : i+1
                        }
                        driveWorkDAO.updateDriveWork(subParams,function(err,result){
                            if (err) {
                                logger.error(' updateDriveWork ' + err.message);
                                //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                                that(null,i);
                            } else {
                                if(result && result.affectedRows > 0){
                                    successedInsert = successedInsert+result.affectedRows;
                                    logger.info(' updateDriveWork ' + 'success');
                                }else{
                                    logger.warn(' updateDriveWork ' + 'failed');
                                }
                                that(null,i);
                            }
                        })
                    }
                }else{
                    that(null,i);
                }

            })

        }).seq(function(){
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadDriveWorkFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function queryDriveWork(req,res,next){
    var params = req.params ;
    driveWorkDAO.getDriveWork(params,function(error,result){
        if (error) {
            logger.error(' queryDriveWork ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveWork ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveWork(req,res,next){
    var params = req.params ;
    driveWorkDAO.updateDriveWork(params,function(error,result){
        if (error) {
            logger.error(' updateDriveWork ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveWork ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveWork : createDriveWork,
    uploadDriveWorkFile : uploadDriveWorkFile,
    queryDriveWork : queryDriveWork,
    updateDriveWork : updateDriveWork
}