/**
 * Created by zwl on 2017/7/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var truckInsureRelDAO = require('../dao/TruckInsureRelDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckInsureRel.js');
var csv=require('csvtojson');
var fs = require('fs');

function createTruckInsureRel(req,res,next){
    var params = req.params ;
    var relId = 0;
    Seq().seq(function(){
        var that = this;
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.insureDate = myDate;
        truckInsureRelDAO.addTruckInsureRel(params,function(err,result){
            if (err) {
                logger.error(' createTruckInsureRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createTruckInsureRel ' + 'success');
                    relId = result.insertId;
                }else{
                    logger.warn(' createTruckInsureRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.relId = relId;
        truckInsureRelDAO.updateTruckInsureRelActive(params, function (err, result) {
                if (err) {
                    logger.error(' updateTruckInsureRelActive ' + err.message);
                    throw sysError.InternalError(err.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateTruckInsureRelActive ' + 'success');
                    } else {
                        logger.warn(' updateTruckInsureRelActive ' + 'failed');
                    }
                    that();
                }
            })
    }).seq(function(){
        logger.info(' createTruckInsureRel ' + 'success');
        resUtil.resetQueryRes(res,{relId:relId},null);
        return next();
    })


}

function queryTruckInsureRel(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.getTruckInsureRel(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsureRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckInsureTypeTotal(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.getTruckInsureTypeTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsureTypeTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsureTypeTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckInsureMoneyTotal(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.getTruckInsureMoneyTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsureMoneyTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsureMoneyTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckInsureCountTotal(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.getTruckInsureCountTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsureCountTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsureCountTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckInsureRel(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.updateTruckInsureRel(params,function(error,result){
        if (error) {
            logger.error(' updateTruckInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckInsureRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeTruckInsureRel(req,res,next){
    var params = req.params;
    params.insureStatus = sysConst.TRUCK_INSURE_STATUS.cancel;
    truckInsureRelDAO.updateTruckInsureStatus(params,function(error,result){
        if (error) {
            logger.error(' removeTruckInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeTruckInsureRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getTruckInsureRelCsv(req,res,next){
    var csvString = "";
    var header = "保单编号" + ',' + "保险公司" + ',' + "险种" + ','+ "保险金额" + ','+
        "货车牌号"+ ','+ "货车类型"+ ',' + "所属公司"+ ',' + "经办人" + ','+ "生效日期" + ','+ "终止日期" + ','+ "保险描述";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    truckInsureRelDAO.getTruckInsureRel(params,function(error,rows){
        if (error) {
            logger.error(' queryTruckInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.insureNum = rows[i].insure_num;
                parkObj.insureName = rows[i].insure_name;
                if(rows[i].insure_type == 1){
                    parkObj.insureType = "交强险";
                }else if(rows[i].insure_type == 2){
                    parkObj.insureType = "商业险";
                }else{
                    parkObj.insureType = "货运险";
                }
                parkObj.insureMoney = rows[i].insure_money;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].truck_type == 1){
                    parkObj.truckType = "车头";
                }else{
                    parkObj.truckType = "挂车";
                }
                if(rows[i].company_name==null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                parkObj.insureUserName = rows[i].insure_user_name;
                parkObj.startDate = moment(rows[i].start_date).format('YYYY-MM-DD');
                parkObj.endDate = moment(rows[i].end_date).format('YYYY-MM-DD');
                if(rows[i].insure_explain==null){
                    parkObj.insureExplain = "";
                }else{
                    parkObj.insureExplain = rows[i].insure_explain.replace(/[\r\n]/g, '');
                }
                csvString = csvString+parkObj.insureNum+","+parkObj.insureName+","+parkObj.insureType+","+parkObj.insureMoney+","+
                    parkObj.truckNum+","+parkObj.truckType+","+parkObj.companyName+","+
                    parkObj.insureUserName+","+parkObj.startDate+","+parkObj.endDate+","+parkObj.insureExplain+ '\r\n';
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

function uploadTruckInsureRelFile(req,res,next){
    var params = req.params;
    var parkObj = {};
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.insureDate = myDate;
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
                if(parkObj.truckId>0){
                    var subParams ={
                        truckId : parkObj.truckId,
                        insureId : objArray[i].保险公司ID,
                        insureType : objArray[i].保险种类ID,
                        insureNum : objArray[i].保单编号,
                        insureMoney : objArray[i].保险金额,
                        taxMoney : objArray[i].税金额,
                        totalMoney : parseInt(objArray[i].保险金额)+parseInt(objArray[i].税金额),
                        insureDate : myDate,
                        startDate : objArray[i].生效日期起始,
                        endDate : objArray[i].生效日期终止,
                        dateId : parseInt(moment(myDate).format('YYYYMMDD')),
                        insureExplain : objArray[i].保险备注,
                        userId : params.userId,
                        row : i+1
                    }
                    truckInsureRelDAO.addTruckInsureRel(subParams,function(err,result){
                        if (err) {
                            logger.error(' addTruckInsureRel ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result&&result.insertId>0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' addTruckInsureRel ' + 'success');
                            }else{
                                logger.warn(' addTruckInsureRel ' + 'failed');
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
            logger.info(' uploadTruckInsureRelFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}


module.exports = {
    createTruckInsureRel : createTruckInsureRel,
    queryTruckInsureRel : queryTruckInsureRel,
    queryTruckInsureTypeTotal : queryTruckInsureTypeTotal,
    queryTruckInsureMoneyTotal : queryTruckInsureMoneyTotal,
    queryTruckInsureCountTotal : queryTruckInsureCountTotal,
    updateTruckInsureRel : updateTruckInsureRel,
    removeTruckInsureRel : removeTruckInsureRel,
    getTruckInsureRelCsv : getTruckInsureRelCsv,
    uploadTruckInsureRelFile : uploadTruckInsureRelFile
}