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
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckInsureRel.js');

function createTruckInsureRel(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.insureDate = myDate;
    truckInsureRelDAO.addTruckInsureRel(params,function(error,result){
        if (error) {
            logger.error(' createTruckInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruckInsureRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
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
    params.insureStatus = sysConst.TRUCK_INSURE__STATUS.cancel;
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
    var header = "保单编号" + ',' + "保险公司" + ',' + "险种" + ','+ "保险金额" + ','+ "货车牌号"+ ','+ "货车类型" + ','+ "经办人" + ','+ "生效日期" + ','+ "终止日期" + ','+ "保险描述";
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
                parkObj.insureUserName = rows[i].insure_user_name;
                parkObj.startDate = new Date(rows[i].start_date).toLocaleDateString();
                parkObj.endDate = new Date(rows[i].end_date).toLocaleDateString();
                parkObj.insureExplain = rows[i].insure_explain;
                csvString = csvString+parkObj.insureNum+","+parkObj.insureName+","+parkObj.insureType+","
                    +parkObj.insureMoney+"," +parkObj.truckNum+","+parkObj.truckType+","
                    +parkObj.insureUserName+","+parkObj.startDate+","+parkObj.endDate+","+parkObj.insureExplain+ '\r\n';
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
    createTruckInsureRel : createTruckInsureRel,
    queryTruckInsureRel : queryTruckInsureRel,
    queryTruckInsureTypeTotal : queryTruckInsureTypeTotal,
    queryTruckInsureMoneyTotal : queryTruckInsureMoneyTotal,
    queryTruckInsureCountTotal : queryTruckInsureCountTotal,
    updateTruckInsureRel : updateTruckInsureRel,
    removeTruckInsureRel : removeTruckInsureRel,
    getTruckInsureRelCsv : getTruckInsureRelCsv
}