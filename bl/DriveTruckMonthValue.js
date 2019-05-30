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

function updateTruckDepreciationFee(req,res,next){
    var params = req.params ;
    driveTruckMonthValueDAO.updateTruckDepreciationFee(params,function(error,result){
        if (error) {
            logger.error(' updateTruckDepreciationFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckDepreciationFee ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
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

function getDriveTruckMonthValueCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' +"货车牌号" + ',' + "所属公司" + ',' + "货车类型" + ','+ "维修类型" + ','+ "起始时间"+ ','+ "结束时间" + ','+
        "维修原因" + ','+ "维修状态" + ','+"维修站" + ','+ "维修金额"+ ','+ "配件金额"+ ','+ "保养金额"+ ','+ "维修描述";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveTruckMonthValueDAO.getDriveTruckMonthValue(params,function(error,rows){
        if (error) {
            logger.error(' getDriveTruckMonthValue ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                if(rows[i].truck_type == 1){
                    parkObj.truckType = "头车";
                }else{
                    parkObj.truckType = "挂车";
                }
                if(rows[i].repair_type == 1){
                    parkObj.repairType = "事故维修";
                }else if(rows[i].repair_type == 2){
                    parkObj.repairType = "公司维修";
                }else{
                    parkObj.repairType = "在外临时维修";
                }
                if(rows[i].repair_date == null){
                    parkObj.repairDate = "";
                }else{
                    parkObj.repairDate = new Date(rows[i].repair_date).toLocaleDateString();
                }
                if(rows[i].end_date == null){
                    parkObj.endDate = "";
                }else{
                    parkObj.endDate = new Date(rows[i].end_date).toLocaleDateString();
                }
                if(rows[i].repair_reason == null){
                    parkObj.repairReason = "";
                }else{
                    parkObj.repairReason = rows[i].repair_reason;
                }
                if(rows[i].repair_status == 0){
                    parkObj.repairStatus = "正在维修";
                }else{
                    parkObj.repairStatus = "维修完成";
                }
                if(rows[i].repair_station_name == null){
                    parkObj.repairStationName = "";
                }else{
                    parkObj.repairStationName = rows[i].repair_station_name;
                }
                if(rows[i].repair_money == null){
                    parkObj.repairMoney = "";
                }else{
                    parkObj.repairMoney = rows[i].repair_money;
                }
                if(rows[i].parts_money == null){
                    parkObj.partsMoney = "";
                }else{
                    parkObj.partsMoney = rows[i].parts_money;
                }
                if(rows[i].maintain_money == null){
                    parkObj.maintainMoney = "";
                }else{
                    parkObj.maintainMoney = rows[i].maintain_money;
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                csvString = csvString+parkObj.id+","+parkObj.truckNum+","+parkObj.companyName+","+parkObj.truckType+","+parkObj.repairType+","+
                    parkObj.repairDate+","+parkObj.endDate+","+parkObj.repairReason+","+parkObj.repairStatus+","+
                    parkObj.repairStationName+","+parkObj.repairMoney+","+parkObj.partsMoney+","+parkObj.maintainMoney+","+parkObj.remark+ '\r\n';
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
    queryDriveTruckMonthValue : queryDriveTruckMonthValue,
    uploadDepreciationFeeFile : uploadDepreciationFeeFile,
    updateTruckDepreciationFee : updateTruckDepreciationFee,
    updateDepreciationFee : updateDepreciationFee,
    getDriveTruckMonthValueCsv : getDriveTruckMonthValueCsv
}