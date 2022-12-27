/**
 * Created by yym on 2021/1/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var truckDAO = require('../dao/TruckDAO.js');
var truckQaDAO = require('../dao/TruckQaDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckQa.js');
var csv=require('csvtojson');
var fs = require('fs');

function createTruckQa(req,res,next){
    var params = req.params ;
    var strDate = moment(params.qaDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    Seq().seq(function() {
        var that = this;
        if(params.qaType == sysConst.TRUCK_QA_TYPE.license){
            truckDAO.updateTruck({truckNum:params.truckNum,licenseDate:params.qaDate + " 00:00:00",truckId:params.truckId},function(error,result){
                if (error) {
                    logger.error(' createTruckQa updateTruck ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' createTruckQa updateTruck ' + 'success');
                        that();
                    } else {
                        logger.warn(' createTruckQa updateTruck ' + 'failed');
                        resUtil.resetFailedRes(res," 运营证时间更新失败 ");
                        return next();
                    }
                }
            })
        }else if(params.qaType == sysConst.TRUCK_QA_TYPE.driving){
            truckDAO.updateTruck({truckNum:params.truckNum,drivingDate:params.qaDate + " 00:00:00",truckId:params.truckId},function(error,result){
                if (error) {
                    logger.error(' createTruckQa updateTruck ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' createTruckQa updateTruck ' + 'success');
                        that();
                    } else {
                        logger.warn(' createTruckQa updateTruck ' + 'failed');
                        resUtil.resetFailedRes(res," 行驶证时间更新失败 ");
                        return next();
                    }
                }
            })
        }

    }).seq(function() {
        truckQaDAO.addUploadTruckQa(params, function (error, result) {
            if (error) {
                logger.error(' createTruckQa ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createTruckQa ' + 'success');
                resUtil.resetCreateRes(res, result, null);
                return next();
            }
        })
    })
}

function queryTruckQa(req,res,next){
    var params = req.params ;
    truckQaDAO.getTruckQa(params,function(error,result){
        if (error) {
            logger.error(' queryTruckQa ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckQa ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function uploadTruckQaFile(req,res,next){
    var params = req.params;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                truckNum : objArray[i].货车牌号,
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
                        }else{
                            parkObj.truckId = 0;
                        }
                        that();
                    }
                })
            }).seq(function() {
                var that = this;
                if(parkObj.truckId>0){
                    if(objArray[i].检车类型 == sysConst.TRUCK_QA_TYPE.license){
                        truckDAO.updateTruck({truckNum:objArray[i].货车牌号,licenseDate:moment([i].检车时间).format('YYYY-MM-DD') + " 00:00:00",truckId:parkObj.truckId},function(error,result){
                            if (error) {
                                logger.error(' createTruckQa updateTruck ' + error.message);
                                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            } else {
                                if (result && result.affectedRows > 0) {
                                    logger.info(' createTruckQa updateTruck ' + 'success');
                                    that();
                                } else {
                                    logger.warn(' createTruckQa updateTruck ' + 'failed');
                                    resUtil.resetFailedRes(res," 运营证时间更新失败 ");
                                    return next();
                                }
                            }
                        })
                    }else if(objArray[i].检车类型 == sysConst.TRUCK_QA_TYPE.driving){
                        truckDAO.updateTruck({truckNum:objArray[i].货车牌号,drivingDate:moment([i].检车时间).format('YYYY-MM-DD') + " 00:00:00",truckId:parkObj.truckId},function(error,result){
                            if (error) {
                                logger.error(' createTruckQa updateTruck ' + error.message);
                                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            } else {
                                if (result && result.affectedRows > 0) {
                                    logger.info(' createTruckQa updateTruck ' + 'success');
                                    that();
                                } else {
                                    logger.warn(' createTruckQa updateTruck ' + 'failed');
                                    resUtil.resetFailedRes(res," 行驶证时间更新失败 ");
                                    return next();
                                }
                            }
                        })
                    }else{
                        that();
                    }
                }else{
                    that();
                }

            }).seq(function(){
                if(parkObj.truckId>0){
                    var subParams ={
                        number : objArray[i].编号,
                        truckId : parkObj.truckId,
                        truckNum : objArray[i].货车牌号,
                        qaType : objArray[i].检车类型,
                        qaFee : objArray[i].检车费用,
                        taxFee : objArray[i].税费,
                        qaDate : objArray[i].检车时间,
                        dateId : parseInt(moment(objArray[i].检车时间).format('YYYYMMDD')),
                        remark : objArray[i].备注,
                        userId : params.userId,
                        uploadId : params.uploadId,
                        row : i+1
                    }
                    truckQaDAO.addUploadTruckQa(subParams,function(err,result){
                        if (err) {
                            logger.error(' createUploadTruckQa ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result&&result.insertId>0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' createUploadTruckQa ' + 'success');
                            }else{
                                logger.warn(' createUploadTruckQa ' + 'failed');
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
            logger.info(' uploadTruckQaFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function getTruckQaCsv(req,res,next){
    var csvString = "";
    var header = "编号" + ',' + "货车牌号" + ','+ "检车类型" + ','+ "检车费用"+ ','+ "税费"+ ',' + "检车时间"+ ','+
        "创建时间"+  ',' + "备注" + ',' +"序号";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    truckQaDAO.getTruckQa(params,function(error,rows){
        if (error) {
            logger.error(' getTruckQaCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                //货车牌号
                if(rows[i].truck_num==null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                //检车类型
                if(rows[i].qa_type == sysConst.TRUCK_QA_TYPE.license){
                    parkObj.qaType = "运营证";
                }else if(rows[i].qa_type == sysConst.TRUCK_QA_TYPE.driving){
                    parkObj.qaType = "行驶证";
                }else{
                    parkObj.qaType = "";
                }
                //检车费用
                if(rows[i].qa_fee==null){
                    parkObj.qaFee = "";
                }else{
                    parkObj.qaFee = rows[i].qa_fee;
                }
                //税费
                if(rows[i].tax_fee==null){
                    parkObj.taxFee = "";
                }else{
                    parkObj.taxFee = rows[i].tax_fee;
                }
                //检车时间
                if(rows[i].qa_date==null){
                    parkObj.qaDate = "";
                }else{
                    parkObj.qaDate = moment(rows[i].qa_date).format('YYYY-MM-DD');
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

                csvString = csvString+parkObj.id+","+parkObj.truckNum+","+parkObj.qaType+","+parkObj.qaFee+
                    ","+parkObj.taxFee+","+parkObj.qaDate+","+parkObj.createdOn+","+parkObj.remark+","+ parkObj.number+","+'\r\n';

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

module.exports = {
    createTruckQa : createTruckQa,
    queryTruckQa : queryTruckQa,
    uploadTruckQaFile : uploadTruckQaFile,
    getTruckQaCsv : getTruckQaCsv
}