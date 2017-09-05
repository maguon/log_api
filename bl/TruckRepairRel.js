/**
 * Created by zwl on 2017/7/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckRepairRelDAO = require('../dao/TruckRepairRelDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckRepairRel.js');

function createTruckRepairRel(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckBase({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].repair_status==listOfValue.REPAIR_STATUS_ACTIVE){
                    that();
                }else{
                    logger.warn(' getTruckBase ' + 'failed');
                    resUtil.resetFailedRes(res," 货车处于维修状态 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
        var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
        var strDate = year + month + day;
        params.dateId = parseInt(strDate);
        params.repairDate = myDate;
        truckRepairRelDAO.addTruckRepairRel(params,function(error,result){
            if (error) {
                logger.error(' createTruckRepairRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createTruckRepairRel ' + 'success');
                    that();
                }else{
                    logger.warn(' createTruckRepairRel ' + 'failed');
                    return next();
                }
            }
        })
    }).seq(function () {
        params.repairStatus = listOfValue.REPAIR_STATUS_NOT_ACTIVE;
        truckDAO.updateRepairStatus(params,function(error,result){
            if (error) {
                logger.error(' updateRepairStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateRepairStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryTruckRepairRel(req,res,next){
    var params = req.params ;
    truckRepairRelDAO.getTruckRepairRel(params,function(error,result){
        if (error) {
            logger.error(' queryTruckRepairRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckRepairRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckRepairRelCount(req,res,next){
    var params = req.params ;
    truckRepairRelDAO.getTruckRepairRelCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckRepairRelCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckRepairRelCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckRepairCountTotal(req,res,next){
    var params = req.params ;
    truckRepairRelDAO.getTruckRepairCountTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckRepairCountTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckRepairCountTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckRepairMoneyTotal(req,res,next){
    var params = req.params ;
    truckRepairRelDAO.getTruckRepairMoneyTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckRepairMoneyTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckRepairMoneyTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckRepairRel(req,res,next){
    var params = req.params ;
    var truckId = 0;
    Seq().seq(function(){
        var that = this;
        truckRepairRelDAO.getTruckRepairRel({relId:params.relId},function(error,rows){
            if (error) {
                logger.error(' getTruckRepairRel ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].repair_status==listOfValue.REPAIR_STATUS_NOT_ACTIVE){
                    truckId = rows[0].truck_id;
                    that();
                }else{
                    logger.warn(' getTruckRepairRel ' + 'failed');
                    resUtil.resetFailedRes(res," 已维修结束 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var myDate = new Date();
        params.endDate = myDate;
        params.repairStatus = listOfValue.REPAIR_STATUS_ACTIVE;
        truckRepairRelDAO.updateTruckRepairRel(params,function(error,result){
            if (error) {
                logger.error(' updateTruckRepairRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckRepairRel ' + 'success');
                }else{
                    logger.warn(' updateTruckRepairRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        params.truckId = truckId;
        params.repairStatus = listOfValue.REPAIR_STATUS_ACTIVE;
        truckDAO.updateRepairStatus(params,function(error,result){
            if (error) {
                logger.error(' updateRepairStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateRepairStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function getTruckRepairCsv(req,res,next){
    var csvString = "";
    var header = "车牌号码" + ',' + "维修时间" + ',' + "结束时间" + ','+ "车辆类型" + ','+ "维修原因"+ ','+ "维修描述" + ','+ "维修金额" + ','+ "维修人" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    truckRepairRelDAO.getTruckRepairRel(params,function(error,rows){
        if (error) {
            logger.error(' getTruckRepairRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].repair_date == null){
                    parkObj.repairDate = null;
                }else{
                    parkObj.repairDate = new Date(rows[i].repair_date).toLocaleDateString();
                }
                if(rows[i].end_date == null){
                    parkObj.endDate = null;
                }else{
                    parkObj.endDate = new Date(rows[i].end_date).toLocaleDateString();
                }
                parkObj.truckType = rows[i].truck_type;
                parkObj.repairReason = rows[i].repair_reason;
                parkObj.remark = rows[i].remark;
                parkObj.repairMoney = rows[i].repair_money;
                parkObj.repairUser = rows[i].repair_user;
                csvString = csvString+parkObj.truckNum+","+parkObj.repairDate+","+parkObj.endDate+","+parkObj.truckType+","+parkObj.repairReason+","+parkObj.remark+","+parkObj.repairMoney+","+parkObj.repairUser+ '\r\n';
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
    createTruckRepairRel : createTruckRepairRel,
    queryTruckRepairRel : queryTruckRepairRel,
    queryTruckRepairRelCount : queryTruckRepairRelCount,
    queryTruckRepairCountTotal : queryTruckRepairCountTotal,
    queryTruckRepairMoneyTotal : queryTruckRepairMoneyTotal,
    updateTruckRepairRel : updateTruckRepairRel,
    getTruckRepairCsv : getTruckRepairCsv
}
