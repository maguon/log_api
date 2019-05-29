/**
 * Created by zwl on 2019/5/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveTruckMonthValueDAO = require('../dao/DriveTruckMonthValueDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveTruckMonthValue.js');
var csv=require('csvtojson');
var fs = require('fs');


function queryDriveTruckMonthValue(req,res,next){
    var params = req.params ;
    driveTruckMonthValueDAO.getDriveTruckMonthValue(params,function(error,result){
        if (error) {
            logger.error(' queryDriveTruckMonthValue ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveTruckMonthValue ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function uploadDepreciationFeeFile(req,res,next){
    var params = req.params;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var depreciationFlag = false;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            Seq().seq(function(){
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
                        }else{
                            parkObj.truckId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    truckId : parkObj.truckId,
                    yMonth : objArray[i].月份,
                    row : i+1,
                }
                driveTruckMonthValueDAO.getDriveTruckMonthValue(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getDriveTruckMonthValue ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            depreciationFlag = true;
                        }else{
                            depreciationFlag = false;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(depreciationFlag){
                    var subParams ={
                        depreciationFee : objArray[i].折旧费,
                        truckId : parkObj.truckId,
                        yMonth : objArray[i].月份,
                        row : i+1
                    }
                    driveTruckMonthValueDAO.updateTruckDepreciationFee(subParams,function(err,result){
                        if (err) {
                            logger.error(' uploadDepreciationFeeFile ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result && result.affectedRows > 0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' uploadDepreciationFeeFile ' + 'success');
                            }else{
                                logger.warn(' uploadDepreciationFeeFile ' + 'failed');
                            }
                            that(null,i);
                        }
                    })
                }else{
                    that(null,i);
                }

            })

        }).seq(function(){
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadDepreciationFeeFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function updateDepreciationFee(req,res,next){
    var params = req.params ;
    driveTruckMonthValueDAO.updateDepreciationFee(params,function(error,result){
        if (error) {
            logger.error(' updateDepreciationFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDepreciationFee ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}



module.exports = {
    queryDriveTruckMonthValue : queryDriveTruckMonthValue,
    uploadDepreciationFeeFile : uploadDepreciationFeeFile,
    updateDepreciationFee : updateDepreciationFee
}