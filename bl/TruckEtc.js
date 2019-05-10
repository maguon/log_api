/**
 * Created by zwl on 2019/5/9.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckEtcDAO = require('../dao/TruckEtcDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckEtc.js');
var csv=require('csvtojson');
var fs = require('fs');

function uploadTruckEtcFile(req,res,next){
    var params = req.params;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                truckNum : objArray[i].车牌号,
                row : i+1,
            }
            Seq().seq(function(){
                var that = this;
                truckDAO.getTruckFirst(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getTruckFirst ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.truckId = rows[0].id;
                            parkObj.driveId = rows[0].drive_id;
                            parkObj.driveName = rows[0].drive_name;
                        }else{
                            parkObj.truckId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(parkObj.truckId>0){
                    var subParams ={
                        truckId : parkObj.truckId,
                        truckNum : objArray[i].车牌号,
                        driveId : parkObj.driveId,
                        driveName : parkObj.driveName,
                        etcFee : objArray[i].费用,
                        etcDate : objArray[i].时间,
                        dateId : parseInt(moment(objArray[i].时间).format('YYYYMMDD')),
                        remark : objArray[i].描述,
                        userId : params.userId,
                        uploadId : params.uploadId,
                        row : i+1
                    }
                    truckEtcDAO.addUploadTruckEtc(subParams,function(err,result){
                        if (err) {
                            logger.error(' createUploadTruckEtc ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result&&result.insertId>0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' createUploadTruckEtc ' + 'success');
                            }else{
                                logger.warn(' createUploadTruckEtc ' + 'failed');
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
            logger.info(' uploadTruckEtcFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function queryTruckEtc(req,res,next){
    var params = req.params ;
    truckEtcDAO.getTruckEtc(params,function(error,result){
        if (error) {
            logger.error(' queryTruckEtc ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckEtc ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    uploadTruckEtcFile : uploadTruckEtcFile,
    queryTruckEtc : queryTruckEtc
}