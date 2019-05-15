/**
 * Created by zwl on 2019/4/9.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilRelDAO = require('../dao/DriveExceedOilRelDAO.js');
var driveExceedOilDAO = require('../dao/DriveExceedOilDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DriveExceedOilRel.js');
var csv=require('csvtojson');
var fs = require('fs');

function createDriveExceedOilRel(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        var oilDate = params.oilDate;
        var strDate = moment(oilDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        driveExceedOilRelDAO.addDriveExceedOilRel(params,function(error, result) {
            if (error) {
                logger.error(' createDriveExceedOilRel ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDriveExceedOilRel ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res," 新增操作失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var subParams ={
            actualOil : params.oil,
            actualUrea : params.urea,
            exceedOilId : params.exceedOilId,
        }
        driveExceedOilDAO.updateActualOilPlus(subParams,function(error,result){
            if (error) {
                logger.error(' updateDriveExceedActualOil ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriveExceedActualOil ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDriveExceedOilRel(req,res,next){
    var params = req.params ;
    driveExceedOilRelDAO.getDriveExceedOilRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveExceedOilRel(req,res,next){
    var params = req.params;
    var parkObj = {};
    Seq().seq(function() {
        var that = this;
        driveExceedOilRelDAO.getDriveExceedOilRel({relId:params.relId}, function (error, rows) {
            if (error) {
                logger.error(' getDriveExceedOilRel ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows && rows.length > 0) {
                    parkObj.oil=rows[0].oil;
                    parkObj.urea=rows[0].urea;
                    parkObj.exceedOilId=rows[0].exceed_oil_id;
                    that();
                } else {
                    logger.warn(' getDriveExceedOilRel ' + 'failed');
                    resUtil.resetFailedRes(res, " 未查到关联数据，或已被删除 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        driveExceedOilRelDAO.deleteDriveExceedOilRel(params,function(error,result){
            if (error) {
                logger.error(' removeDriveExceedOilRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDriveExceedOilRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeDriveExceedOilRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var subParams ={
            actualOil : parkObj.oil,
            actualUrea : parkObj.urea,
            exceedOilId : parkObj.exceedOilId,
        }
        driveExceedOilDAO.updateActualOilMinus(subParams,function(error,result){
            if (error) {
                logger.error(' updateActualOilMinus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateActualOilMinus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function uploadDriveExceedOilRelFile(req,res,next){
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
                    truckNum : objArray[i].车号,
                    row : i+1,
                }
                truckDAO.getTruckBase(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getTruckBase ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.truckId = rows[0].id;
                        }else{
                            parkObj.truckId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    driveName : objArray[i].司机,
                    row : i+1,
                }
                driveDAO.getDrive(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getDrive ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length>0) {
                            parkObj.driveId = rows[0].id;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(parkObj.truckId>0){
                    var subParams = {
                        exceedOilId : 0,
                        truckId : parkObj.truckId,
                        driveId : parkObj.driveId,
                        oilDate : objArray[i].时间,
                        dateId : parseInt(moment(objArray[i].时间).format('YYYYMMDD')),
                        oilAddress : objArray[i].地点,
                        oil : objArray[i].加油升数,
                        urea : objArray[i].加尿素量,
                        oilSinglePrice : objArray[i].加油单价,
                        ureaSinglePrice : objArray[i].尿素单价,
                        oilMoney : objArray[i].加油金额,
                        ureaMoney : objArray[i].尿素金额,
                        row: i + 1
                    }
                    driveExceedOilRelDAO.addDriveExceedOilRel(subParams, function (err, result) {
                        if (err) {
                            logger.error(' createUploadDriveExceedOilRel ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null, i);
                        } else {
                            if (result && result.insertId > 0) {
                                successedInsert = successedInsert + result.affectedRows;
                                logger.info(' createUploadDriveExceedOilRel ' + 'success');
                            } else {
                                logger.warn(' createUploadDriveExceedOilRel ' + 'failed');
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
            logger.info(' uploadDriveExceedOilRelFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}


module.exports = {
    createDriveExceedOilRel : createDriveExceedOilRel,
    queryDriveExceedOilRel : queryDriveExceedOilRel,
    removeDriveExceedOilRel : removeDriveExceedOilRel,
    uploadDriveExceedOilRelFile : uploadDriveExceedOilRelFile
}
