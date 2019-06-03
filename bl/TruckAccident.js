/**
 * Created by zwl on 2018/2/2.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckAccidentDAO = require('../dao/TruckAccidentDAO.js');
var truckAccidentCheckDAO = require('../dao/TruckAccidentCheckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckAccident.js');

function createTruckAccident(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    truckAccidentDAO.addTruckAccident(params,function(error,result){
        if (error) {
            logger.error(' createTruckAccident ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruckAccident ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccident(req,res,next){
    var params = req.params ;
    if(params.endDateStart){
        var endDateStart = params.endDateStart;
        params.endDateStart = moment(endDateStart).format('YYYY-MM-DD');
    }
    if(params.endDateEnd){
        var endDateEnd = params.endDateEnd;
        params.endDateEnd = moment(endDateEnd).format('YYYY-MM-DD');
    }
    truckAccidentDAO.getTruckAccident(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccident ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccident ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccident(req,res,next){
    var params = req.params ;
    truckAccidentDAO.updateTruckAccident(params,function(error,result){
        if (error) {
            logger.error(' updateTruckAccident ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckAccident ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccidentStatus(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        truckAccidentDAO.updateTruckAccidentStatus(params,function(error,result){
            if (error) {
                logger.error(' updateTruckAccidentStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckAccidentStatus ' + 'success');
                    that();
                }else{
                    logger.warn(' updateTruckAccidentStatus ' + 'failed');
                    resUtil.resetFailedRes(res," 事故处理完成失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.endDate = myDate;
        truckAccidentCheckDAO.updateTruckAccidentCheckFinishTime(params,function(error,result){
            if (error) {
                logger.error(' updateTruckAccidentCheckFinishTime ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckAccidentCheckFinishTime ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryTruckAccidentNotCheckCount(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccidentNotCheckCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentNotCheckCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentNotCheckCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentTotalCost(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccidentTotalCost(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentTotalCost ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentTotalCost ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentTypeMonthStat(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccidentTypeMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentTypeMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentTypeMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentCostMonthStat(req,res,next){
    var params = req.params ;
    truckAccidentDAO.getTruckAccidentCostMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentCostMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentCostMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getTruckAccidentCsv(req,res,next){
    var csvString = "";
    var header = "事故编号" + ',' + "货车牌号" + ',' + "货车类型" + ','+ "司机" + ','+ "调度编号"+ ','+ "起始城市" + ','+ "目的城市" + ','+
        "发生时间" + ',' + "所属公司" + ',' + "事故类型" + ','+ "事故地点" + ','+ "备注"+ ','+ "负责人"+ ','+ "个人承担金额" + ','+
        "公司承担金额" + ','+ "盈亏" + ','+ "处理概述" + ','+"处理人" + ','+"状态" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    truckAccidentDAO.getTruckAccident(params,function(error,rows){
        if (error) {
            logger.error(' getTruckAccident ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].truck_type == 1){
                    parkObj.truckType = "头车";
                }else{
                    parkObj.truckType = "挂车";
                }
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].dp_route_task_id == null){
                    parkObj.dpRouteTaskId = "";
                }else{
                    parkObj.dpRouteTaskId = rows[i].dp_route_task_id;
                }
                if(rows[i].city_route_start == null){
                    parkObj.cityRouteStart = "";
                }else{
                    parkObj.cityRouteStart = rows[i].city_route_start;
                }
                if(rows[i].city_route_end == null){
                    parkObj.cityRouteEnd = "";
                }else{
                    parkObj.cityRouteEnd = rows[i].city_route_end;
                }
                if(rows[i].accident_date == null){
                    parkObj.accidentDate = "";
                }else{
                    parkObj.accidentDate = new Date(rows[i].accident_date).toLocaleDateString();
                }
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                if(rows[i].truck_accident_type == 1){
                    parkObj.truckAccidentType = "一般";
                }else{
                    parkObj.truckAccidentType = "严重";
                }
                if(rows[i].address == null){
                    parkObj.address = "";
                }else{
                    parkObj.address = rows[i].address;
                }
                if(rows[i].accident_explain == null){
                    parkObj.accidentExplain = "";
                }else{
                    parkObj.accidentExplain = rows[i].accident_explain;
                }
                if(rows[i].under_user_name == null){
                    parkObj.underUserName = "";
                }else{
                    parkObj.underUserName = rows[i].under_user_name;
                }
                if(rows[i].under_cost == null){
                    parkObj.underCost = "";
                }else{
                    parkObj.underCost = rows[i].under_cost;
                }
                if(rows[i].company_cost == null){
                    parkObj.companyCost = "";
                }else{
                    parkObj.companyCost = rows[i].company_cost;
                }
                if(rows[i].profit == null){
                    parkObj.profit = "";
                }else{
                    parkObj.profit = rows[i].profit;
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                if(rows[i].op_user_name == null){
                    parkObj.opUserName = "";
                }else{
                    parkObj.opUserName = rows[i].op_user_name;
                }
                if(rows[i].accident_status == 1){
                    parkObj.accidentStatus = "待处理";
                }else if(rows[i].accident_status == 2){
                    parkObj.accidentStatus = "处理中";
                }else{
                    parkObj.accidentStatus = "已处理";
                }
                csvString = csvString+parkObj.id+","+parkObj.truckNum+","+parkObj.truckType+","+parkObj.driveName+","+parkObj.dpRouteTaskId+","+
                    parkObj.cityRouteStart+","+parkObj.cityRouteEnd+","+parkObj.accidentDate+","+ parkObj.companyName+","+parkObj.truckAccidentType+","+
                    parkObj.address+","+ parkObj.accidentExplain+","+parkObj.underUserName+","+parkObj.underCost+","+
                    parkObj.companyCost+","+parkObj.profit+","+parkObj.remark+","+parkObj.opUserName+","+parkObj.accidentStatus+ '\r\n';
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
    createTruckAccident : createTruckAccident,
    queryTruckAccident : queryTruckAccident,
    updateTruckAccident : updateTruckAccident,
    updateTruckAccidentStatus : updateTruckAccidentStatus,
    queryTruckAccidentNotCheckCount : queryTruckAccidentNotCheckCount,
    queryTruckAccidentTotalCost : queryTruckAccidentTotalCost,
    queryTruckAccidentTypeMonthStat : queryTruckAccidentTypeMonthStat,
    queryTruckAccidentCostMonthStat : queryTruckAccidentCostMonthStat,
    getTruckAccidentCsv : getTruckAccidentCsv
}