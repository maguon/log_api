/**
 * Created by zwl on 2018/9/25.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var settleCarDAO = require('../dao/SettleCarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('SettleCar.js');
var csv=require('csvtojson');
var fs = require('fs');

function createSettleCar(req,res,next){
    var params = req.params ;
    settleCarDAO.addSettleCar(params,function(error,result){
        if (error) {
            logger.error(' createSettleCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createSettleCar ' + 'success ');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function querySettleCar(req,res,next){
    var params = req.params ;
    settleCarDAO.getSettleCar(params,function(error,result){
        if (error) {
            logger.error(' querySettleCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function querySettleCarCount(req,res,next){
    var params = req.params ;
    settleCarDAO.getSettleCarCount(params,function(error,result){
        if (error) {
            logger.error(' querySettleCarCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleCarCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryNotSettleCarCount(req,res,next){
    var params = req.params ;
    settleCarDAO.getNotSettleCarCount(params,function(error,result){
        if (error) {
            logger.error(' queryNotSettleCarCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryNotSettleCarCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateSettleCar(req,res,next){
    var params = req.params ;
    settleCarDAO.updateSettleCar(params,function(error,result){
        if (error) {
            logger.error(' updateSettleCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateSettleCar ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function uploadSettleCarFile(req,res,next){
    var params = req.params;
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                vin : objArray[i].vin,
                entrustId : objArray[i].entrustId,
                routeStartId : objArray[i].routeStartId,
                routeEndId : objArray[i].routeEndId,
                orderDateId : objArray[i].orderDateId,
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
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadSettleCarFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function getSettleCarCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "委托方" + ','+ "品牌" + ',' + "起始省份" +  ',' + "起始城市" + ','+ "目的省份" + ','+ "目的城市" + ','+
        "公里数"+ ','+ "价格/公里"+ ','+ "实际金额"+ ','+ "当前公里数"+ ','+ "当前单价"+ ','+"指令时间" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    settleCarDAO.getSettleCar(params,function(error,rows){
        if (error) {
            logger.error(' getSettleCarCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                if(rows[i].e_short_name == null){
                    parkObj.eShortName = "";
                }else{
                    parkObj.eShortName = rows[i].e_short_name;
                }
                if(rows[i].make_name == null){
                    parkObj.make_name = "";
                }else{
                    parkObj.makeName = rows[i].make_name;
                }
                //起始省份
                if(rows[i].province_start_name == null){
                    parkObj.provinceStartName = "";
                }else{
                    parkObj.provinceStartName = rows[i].province_start_name;
                }
                //起始城市
                if(rows[i].route_start == null){
                    parkObj.routeStart = "";
                }else{
                    parkObj.routeStart = rows[i].route_start;
                }
                //目的省份
                if(rows[i].province_end_name == null){
                    parkObj.provinceEndName = "";
                }else{
                    parkObj.provinceEndName = rows[i].province_end_name;
                }
                //目的城市
                if(rows[i].route_end == null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                if(rows[i].fee == null){
                    parkObj.fee = "";
                }else{
                    parkObj.fee = rows[i].fee;
                }
                parkObj.price = rows[i].price+rows[i].price_2+rows[i].price_3+rows[i].price_4+rows[i].price_5;
                if(rows[i].current_distance == null){
                    parkObj.currentDistance = "";
                }else{
                    parkObj.currentDistance = rows[i].current_distance;
                }
                if(rows[i].current_fee == null){
                    parkObj.currentFee = "";
                }else{
                    parkObj.currentFee = rows[i].current_fee;
                }
                if(rows[i].order_date == null){
                    parkObj.orderDate = "";
                }else{
                    parkObj.orderDate = moment(rows[i].order_date).format('YYYY-MM-DD');
                }
                csvString = csvString+parkObj.vin+","+parkObj.eShortName+","+parkObj.makeName+","+parkObj.provinceStartName+","+parkObj.routeStart+","+
                    parkObj.provinceEndName +","+parkObj.routeEnd +","+
                    parkObj.distance+","+parkObj.fee+","+parkObj.price+","+parkObj.currentDistance+","+parkObj.currentFee+","+
                    parkObj.orderDate+ '\r\n';
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

function getNotSettleCarCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "委托方" + ','+ "品牌" + ','  + "起始城市" + ','+ "目的城市" + ','+ "公里数"+ ','+ "价格/公里"+ ','+
        "预计金额"+ ','+"指令时间" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    settleCarDAO.getSettleCar(params,function(error,rows){
        if (error) {
            logger.error(' getSettleCarCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                if(rows[i].e_short_name == null){
                    parkObj.eShortName = "";
                }else{
                    parkObj.eShortName = rows[i].e_short_name;
                }
                if(rows[i].make_name == null){
                    parkObj.makeName = "";
                }else{
                    parkObj.makeName = rows[i].make_name;
                }
                if(rows[i].route_start == null){
                    parkObj.routeStart = "";
                }else{
                    parkObj.routeStart = rows[i].route_start;
                }
                if(rows[i].route_end == null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                if(rows[i].fee == null){
                    parkObj.fee = "";
                }else{
                    parkObj.fee = rows[i].fee;
                }
                if(rows[i].plan_price == null){
                    parkObj.planPrice = "";
                }else{
                    parkObj.planPrice = rows[i].plan_price;
                }
                if(rows[i].order_date == null){
                    parkObj.orderDate = "";
                }else{
                    parkObj.orderDate = moment(rows[i].order_date).format('YYYY-MM-DD');
                }
                csvString = csvString+parkObj.vin+","+parkObj.eShortName+","+parkObj.makeName+","+parkObj.routeStart+","+parkObj.routeEnd +","+
                    parkObj.distance+","+parkObj.fee+","+parkObj.planPrice+","+parkObj.orderDate+ '\r\n';
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

function getEntrustStat(req,res,next){
    var params = req.params ;
    settleCarDAO.getEntrustStat(params,function(error,result){
        if (error) {
            logger.error(' getEntrustStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getEntrustStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    createSettleCar : createSettleCar,
    querySettleCar : querySettleCar,
    querySettleCarCount : querySettleCarCount,
    queryNotSettleCarCount : queryNotSettleCarCount,
    updateSettleCar : updateSettleCar,
    uploadSettleCarFile : uploadSettleCarFile,
    getSettleCarCsv : getSettleCarCsv,
    getNotSettleCarCsv : getNotSettleCarCsv,
    getEntrustStat : getEntrustStat
}