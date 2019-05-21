/**
 * Created by zwl on 2019/5/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckDepreciationDAO = require('../dao/TruckDepreciationDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDepreciation.js');
var csv=require('csvtojson');
var fs = require('fs');

function createTruckDepreciation(req,res,next){
    var params = req.params ;
    truckDepreciationDAO.addTruckDepreciation(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "数据已经存在，操作失败");
                return next();
            } else{
                logger.error(' createTruckDepreciation ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createTruckDepreciation ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function uploadTruckDepreciationFile(req,res,next){
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
                    driveName : objArray[i].司机,
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
                        }else{
                            parkObj.truckId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(parkObj.driveId>0&&parkObj.truckId>0){
                    var subParams ={
                        driveId : parkObj.driveId,
                        driveName : objArray[i].司机,
                        truckId : parkObj.truckId,
                        truckNum : objArray[i].货车牌号,
                        yMonth : objArray[i].月份,
                        depreciationFee : objArray[i].折旧费,
                        row : i+1
                    }
                    truckDepreciationDAO.addTruckDepreciation(subParams,function(err,result){
                        if (err) {
                            logger.error(' createTruckDepreciation ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result&&result.insertId>0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' createTruckDepreciation ' + 'success');
                            }else{
                                logger.warn(' createTruckDepreciation ' + 'failed');
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
            logger.info(' uploadTruckDepreciationFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function queryTruckDepreciation(req,res,next){
    var params = req.params ;
    truckDepreciationDAO.getTruckDepreciation(params,function(error,result){
        if (error) {
            logger.error(' queryTruckDepreciation ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckDepreciation ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckDepreciation : createTruckDepreciation,
    uploadTruckDepreciationFile : uploadTruckDepreciationFile,
    queryTruckDepreciation : queryTruckDepreciation
}