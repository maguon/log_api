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
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckRepairRel.js');

function createTruckRepairRel(req,res,next){
    var params = req.params ;
    var truckRepairRelId = 0;
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
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.repairDate = myDate;
        truckRepairRelDAO.addTruckRepairRel(params,function(error,result){
            if (error) {
                logger.error(' createTruckRepairRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createTruckRepairRel ' + 'success');
                    truckRepairRelId = result.insertId;
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
                resUtil.resetQueryRes(res,{truckRepairRelId:truckRepairRelId},null);
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

function updateTruckRepairRelBase(req,res,next){
    var params = req.params ;
    if(params.repairType==2){
        params.accidentId = null;
    }
    truckRepairRelDAO.updateTruckRepairRelBase(params,function(error,result){
        if (error) {
            logger.error(' updateTruckRepairRelBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckRepairRelBase ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


function getTruckRepairCsv(req,res,next){
    var csvString = "";
    var header = "维修编号" + ',' +"货车牌号" + ',' + "所属公司" + ',' + "货车类型" + ','+ "维修类型" + ','+ "起始时间"+ ','+ "结束时间" + ','+
        "维修原因" + ','+ "维修状态" + ','+"维修站" + ','+ "维修金额"+ ','+ "配件金额"+ ','+ "保养金额"+ ','+ "维修描述";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    truckRepairRelDAO.getTruckRepairRel(params,function(error,rows){
        if (error) {
            logger.error(' getTruckRepairRel ' + error.message);
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
                }else if(rows[i].truck_type == 2){
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
    createTruckRepairRel : createTruckRepairRel,
    queryTruckRepairRel : queryTruckRepairRel,
    queryTruckRepairRelCount : queryTruckRepairRelCount,
    queryTruckRepairCountTotal : queryTruckRepairCountTotal,
    queryTruckRepairMoneyTotal : queryTruckRepairMoneyTotal,
    updateTruckRepairRel : updateTruckRepairRel,
    updateTruckRepairRelBase : updateTruckRepairRelBase,
    getTruckRepairCsv : getTruckRepairCsv
}
