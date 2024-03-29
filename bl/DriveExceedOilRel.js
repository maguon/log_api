/**
 * Created by zwl on 2019/4/9.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
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
    var relId = 0;
    Seq().seq(function(){
        var that = this;
        var oilDate = params.oilDate;
        var strDate = moment(oilDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        if(params.paymentType==sysConst.PAYMENT_TYPE.no){
            params.paymentStatus = sysConst.PAYMENT_STATUS.payment;
        }else{
            params.paymentStatus = sysConst.PAYMENT_STATUS.not_payment;
        }
        driveExceedOilRelDAO.addDriveExceedOilRel(params,function(error, result) {
            if (error) {
                logger.error(' createDriveExceedOilRel ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){

                    logger.info(' createDriveExceedOilRel ' + 'success');
                    relId = result.insertId;
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
                resUtil.resetQueryRes(res,{relId:relId},null);
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

function queryDriveExceedOilRelCount(req,res,next){
    var params = req.params ;
    driveExceedOilRelDAO.getDriveExceedOilRelCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilRelCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilRelCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOilRel(req,res,next){
    var params = req.params ;
    var strDate = moment(params.oilDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    driveExceedOilRelDAO.updateDriveExceedOilRel(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOilRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOilRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updatePaymentStatus(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.oilDate = myDate;
    params.dateId = parseInt(strDate);
    driveExceedOilRelDAO.updatePaymentStatus(params,function(error,result){
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

function queryDriveExceedOilRelMonthStat(req,res,next){
    var params = req.params ;
    driveExceedOilRelDAO.getDriveExceedOilRelMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilRelMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilRelMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilMoneyMonthStat(req,res,next){
    var params = req.params ;
    driveExceedOilRelDAO.getDriveExceedOilMoneyMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilMoneyMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilMoneyMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilRelWeekStat(req,res,next){
    var params = req.params ;
    driveExceedOilRelDAO.getDriveExceedOilRelWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilRelWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilRelWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
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
                        }else{
                            parkObj.driveId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(parkObj.truckId>0&&parkObj.driveId>0){
                    var subParams = {
                        number : objArray[i].编号,
                        exceedOilId : 0,
                        truckId : parkObj.truckId,
                        driveId : parkObj.driveId,
                        oilDate : objArray[i].时间,
                        dateId : parseInt(moment(objArray[i].时间).format('YYYYMMDD')),
                        oilAddressType : sysConst.OIL_ADDRESS_TYPE.outside,
                        oilAddress : objArray[i].地点,
                        oil : objArray[i].加油升数,
                        urea : objArray[i].加尿素量,
                        oilSinglePrice : objArray[i].加油单价,
                        ureaSinglePrice : objArray[i].尿素单价,
                        oilMoney : objArray[i].加油金额,
                        ureaMoney : objArray[i].尿素金额,
                        paymentType : sysConst.PAYMENT_TYPE.no,
                        paymentStatus : sysConst.PAYMENT_STATUS.payment,
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

function getDriveExceedOilRelCsv(req,res,next){
    var csvString = "";
    var header = "编号" + ',' +"司机" + ',' + "货车牌号" + ',' + "加油量" + ','+ "加尿素量" + ','+ "加油单价"+ ','+ "加尿素单价" + ','+
        "加油总价" + ','+ "加尿素总价" + ','+"加油时间" + ','+ "创建时间"+ ','+ "地点"+ ','+
    "序号"+ ',' +"财务打款"+ ',' + "状态"+ ',' +"银行账号" + ','+ "户名"+ ','+ "开户行";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveExceedOilRelDAO.getDriveExceedOilRel(params,function(error,rows){
        if (error) {
            logger.error(' getDriveExceedOilRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                if(rows[i].drive_name == null){
                    parkObj.driveName = "";
                }else{
                    parkObj.driveName = rows[i].drive_name;
                }
                if(rows[i].truck_num == null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                if(rows[i].oil == null){
                    parkObj.oil = "";
                }else{
                    parkObj.oil = rows[i].oil;
                }
                if(rows[i].urea == null){
                    parkObj.urea = "";
                }else{
                    parkObj.urea = rows[i].urea;
                }
                if(rows[i].oil_single_price == null){
                    parkObj.oilSinglePrice = "";
                }else{
                    parkObj.oilSinglePrice = rows[i].oil_single_price;
                }
                if(rows[i].urea_single_price == null){
                    parkObj.ureaSinglePrice = "";
                }else{
                    parkObj.ureaSinglePrice = rows[i].urea_single_price;
                }
                if(rows[i].oil_money == null){
                    parkObj.oilMoney = "";
                }else{
                    parkObj.oilMoney = rows[i].oil_money;
                }
                if(rows[i].urea_money == null){
                    parkObj.ureaMoney = "";
                }else{
                    parkObj.ureaMoney = rows[i].urea_money;
                }
                if(rows[i].oil_date == null){
                    parkObj.oilDate = "";
                }else{
                    parkObj.oilDate = moment(rows[i].oil_date).format('YYYY-MM-DD');
                }
                if(rows[i].created_on == null){
                    parkObj.createdOn = "";
                }else{
                    parkObj.createdOn = moment(rows[i].created_on).format('YYYY-MM-DD');
                }
                if(rows[i].oil_address == null){
                    parkObj.oilAddress = "";
                }else{
                    parkObj.oilAddress = rows[i].oil_address;
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
                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.oil+","+parkObj.urea+","+
                    parkObj.oilSinglePrice+","+parkObj.ureaSinglePrice+","+parkObj.oilMoney+","+parkObj.ureaMoney+","+
                    parkObj.oilDate+","+parkObj.createdOn+","+parkObj.oilAddress+","+
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
        var relIds = params.relIds;
        var rowArray = [] ;
        rowArray.length= relIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                paymentStatus : params.paymentStatus,
                oilDate : myDate,
                dateId : parseInt(strDate),
                relId : relIds[i],
                row : i+1,
            }
            driveExceedOilRelDAO.updatePaymentStatus(subParams,function(err,result){
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
    createDriveExceedOilRel : createDriveExceedOilRel,
    queryDriveExceedOilRel : queryDriveExceedOilRel,
    queryDriveExceedOilRelCount : queryDriveExceedOilRelCount,
    updateDriveExceedOilRel : updateDriveExceedOilRel,
    updatePaymentStatus : updatePaymentStatus,
    removeDriveExceedOilRel : removeDriveExceedOilRel,
    queryDriveExceedOilRelMonthStat : queryDriveExceedOilRelMonthStat,
    queryDriveExceedOilMoneyMonthStat : queryDriveExceedOilMoneyMonthStat,
    queryDriveExceedOilRelWeekStat : queryDriveExceedOilRelWeekStat,
    uploadDriveExceedOilRelFile : uploadDriveExceedOilRelFile,
    getDriveExceedOilRelCsv : getDriveExceedOilRelCsv,
    updatePaymentStatusAll : updatePaymentStatusAll
}
