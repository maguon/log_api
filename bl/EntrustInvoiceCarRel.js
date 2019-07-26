/**
 * Created by zwl on 2019/7/25.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var entrustInvoiceCarRelDAO = require('../dao/EntrustInvoiceCarRelDAO.js');
var carDAO = require('../dao/CarDAO.js');
var settleCarDAO = require('../dao/SettleCarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustInvoiceCarRel.js');
var csv=require('csvtojson');
var fs = require('fs');

function uploadEntrustInvoiceCarRelFile(req,res,next){
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
                    vin : objArray[i].vin,
                    entrustId : objArray[i].entrustId,
                    routeStartId : objArray[i].routeStartId,
                    routeEndId : objArray[i].routeEndId,
                    row : i+1,
                }
                carDAO.getCarList(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getCarList ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length>0) {
                            parkObj.carId = rows[0].id;
                        }else{
                            parkObj.carId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    vin : objArray[i].vin,
                    entrustId : objArray[i].entrustId,
                    routeStartId : objArray[i].routeStartId,
                    routeEndId : objArray[i].routeEndId,
                    price : objArray[i].price,
                    seq : objArray[i].seq,
                    settleStatus : sysConst.SETTLE_STATUS.settle,
                    userId : params.userId,
                    uploadId : params.uploadId,
                    row : i+1,
                }
                settleCarDAO.updateUploadSettleCar(subParams,function(err,result){
                    if (err) {
                        if(err.message.indexOf("Duplicate") > 0) {
                            failedCase=objArray.length-successedInsert;
                            resUtil.resetFailedRes(res, "数据已存在，上传失败 本次成功上传"+successedInsert+"条 失败"+failedCase+"条");
                            return next();
                        } else{
                            logger.error(' createUploadSettleCar ' + err.message);
                            throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                        }
                    } else {
                        if(result && result.affectedRows > 0){
                            successedInsert = successedInsert+result.affectedRows;
                            logger.info(' createUploadSettleCar ' + 'success');
                        }else{
                            logger.warn(' createUploadSettleCar ' + 'failed');
                        }
                        that(null,i);
                    }
                })
            }).seq(function(){
                var subParams ={
                    carId : parkObj.carId,
                    entrustId : objArray[i].entrustId,
                    price : objArray[i].price,
                    row : i+1,
                }
                entrustInvoiceCarRelDAO.addEntrustInvoiceCarRel(subParams,function(err,result){
                    if (err) {
                        logger.error(' addEntrustInvoiceCarRel ' + err.message);
                        //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                        that(null,i);
                    } else {
                        if(result&&result.insertId>0){
                            logger.info(' addEntrustInvoiceCarRel ' + 'success');
                        }else{
                            logger.warn(' addEntrustInvoiceCarRel ' + 'failed');
                        }
                        that(null,i);
                    }
                })
            })
        }).seq(function(){
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadEntrustInvoiceCarRelFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}


module.exports = {
    uploadEntrustInvoiceCarRelFile : uploadEntrustInvoiceCarRelFile
}
