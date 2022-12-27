/**
 * Created by zwl on 2019/5/9.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var truckEtcDAO = require('../dao/TruckEtcDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckEtc.js');
var csv=require('csvtojson');
var fs = require('fs');

function createTruckEtc(req,res,next){
    var params = req.params ;
    var strDate = moment(params.etcDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    if(params.paymentType==sysConst.PAYMENT_TYPE.no){
        params.paymentStatus = sysConst.PAYMENT_STATUS.payment;
    }else{
        params.paymentStatus = sysConst.PAYMENT_STATUS.not_payment;
    }
    truckEtcDAO.addUploadTruckEtc(params,function(error,result){
        if (error) {
            logger.error(' createTruckEtc ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruckEtc ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

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
                        number : objArray[i].编号,
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
                        paymentType : sysConst.PAYMENT_TYPE.no,
                        paymentStatus : sysConst.PAYMENT_STATUS.payment,
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

function queryTruckEtcFeeCount(req,res,next){
    var params = req.params ;
    truckEtcDAO.getTruckEtcFeeCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckEtcFeeCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckEtcFeeCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updatePaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.etcDate = myDate;
    params.dateId = parseInt(strDate);
    truckEtcDAO.updatePaymentStatus(params,function(error,result){
        if (error) {
            logger.error(' updatePaymentStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updatePaymentStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getTruckEtcCsv(req,res,next){
    var csvString = "";
    var header = "编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "通行费" + ','+ "交易时间"+ ','+ "创建时间"+ ',' + "描述"+ ',' +
        "序号"+ ',' +"财务打款"+ ',' + "状态"+ ',' +"银行账号" + ','+ "户名"+ ','+ "开户行";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    truckEtcDAO.getTruckEtc(params,function(error,rows){
        if (error) {
            logger.error(' getTruckEtcCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                if(rows[i].drive_name==null){
                    parkObj.driveName = "";
                }else{
                    parkObj.driveName = rows[i].drive_name;
                }
                if(rows[i].truck_num==null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                if(rows[i].etc_fee==null){
                    parkObj.etcFee = "";
                }else{
                    parkObj.etcFee = rows[i].etc_fee;
                }
                if(rows[i].etc_date==null){
                    parkObj.etcDate = "";
                }else{
                    parkObj.etcDate = moment(rows[i].etc_date).format('YYYY-MM-DD');
                }
                if(rows[i].created_on==null){
                    parkObj.createdOn = "";
                }else{
                    parkObj.createdOn = moment(rows[i].created_on).format('YYYY-MM-DD');
                }
                if(rows[i].remark==null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark.replace(/[\r\n]/g, '');
                }
                if(rows[i].number == null){
                    parkObj.number = "";
                }else{
                    parkObj.number = rows[i].number;
                }
                if(rows[i].payment_type == 1){
                    parkObj.paymentType = "否";
                }else{
                    parkObj.paymentType = "是";
                }
                if(rows[i].payment_status == 0){
                    parkObj.paymentStatus = "未处理";
                }else if(rows[i].payment_status == 1){
                    parkObj.paymentStatus = "已付款";
                }else{
                    parkObj.paymentStatus = "驳回";
                }
                if(rows[i].bank_number==null){
                    parkObj.bankNumber = "";
                }else{
                    parkObj.bankNumber = rows[i].bank_number;
                }
                if(rows[i].bank_name==null){
                    parkObj.bankName = "";
                }else{
                    parkObj.bankName = rows[i].bank_name;
                }
                if(rows[i].bank_user_name==null){
                    parkObj.bankUserName = "";
                }else{
                    parkObj.bankUserName = rows[i].bank_user_name;
                }
                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.etcFee+","+
                    parkObj.etcDate+","+parkObj.createdOn+","+parkObj.remark+","+
                    parkObj.number+","+parkObj.paymentType+","+parkObj.paymentStatus+","+
                parkObj.bankNumber+","+parkObj.bankName+","+parkObj.bankUserName+'\r\n';

            }
            var csvBuffer = new Buffer(csvString,'utf8');
            res.set('content-type', 'application/csv');
            res.set('charset', 'utf8');
            res.set('content-length', csvBuffer.length);
            res.writeHead(200);
            res.write(csvBuffer);//TODO
            res.end();
            return next(false);
        }
    })
}

function updatePaymentStatusAll(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    Seq().seq(function(){
        var that = this;
        var truckEtcIds = params.truckEtcIds;
        var rowArray = [] ;
        rowArray.length= truckEtcIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                paymentStatus : params.paymentStatus,
                etcDate : myDate,
                dateId : parseInt(strDate),
                truckEtcId : truckEtcIds[i],
                row : i+1,
            }
            truckEtcDAO.updatePaymentStatus(subParams,function(err,result){
                if (err) {
                    logger.error(' updatePaymentStatusAll ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.affectedRows>0){
                        logger.info(' updatePaymentStatusAll  ' + 'success');
                    }else{
                        logger.warn(' updatePaymentStatusAll  ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' updatePaymentStatusAll ' + 'success');
        resUtil.resetQueryRes(res,null);
        return next();
    })
}


module.exports = {
    createTruckEtc : createTruckEtc,
    uploadTruckEtcFile : uploadTruckEtcFile,
    queryTruckEtc : queryTruckEtc,
    queryTruckEtcFeeCount : queryTruckEtcFeeCount,
    updatePaymentStatus : updatePaymentStatus,
    getTruckEtcCsv : getTruckEtcCsv,
    updatePaymentStatusAll : updatePaymentStatusAll
}