/**
 * Created by zwl on 2019/5/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilDateDAO = require('../dao/DriveExceedOilDateDAO.js');
var dpRouteTaskOilRelDAO = require('../dao/DpRouteTaskOilRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDate.js');

function createDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.addDriveExceedOilDate(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "本月已结，操作失败");
                return next();
            } else{
                logger.error(' createDriveExceedOilDate ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createDriveExceedOilDate ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.getDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilMonth(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.getDriveExceedOilMonth(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilMonth ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.updateDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOilDate ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOilDateMoney(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.updateDriveExceedOilDateMoney(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOilDateMoney ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOilDateMoney ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateExceedOilDateCheckStatus(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.updateExceedOilDateCheckStatus(params,function(error,result){
        if (error) {
            logger.error(' updateExceedOilDateCheckStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateExceedOilDateCheckStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getDriveExceedOilDateCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' + "司机" + ',' + "货车牌号" + ','+ "所属类型" + ','+"所属公司" + ','+ "计划用油量" + ','+
        "实际用油量" + ','+"计划尿素量"+','+ "实际尿素量" + ','+ "结余油量" + ','+ "结余尿素量" + ','+
        "本月油补" + ','+"本月尿素补" + ','+ "超油量" + ','+ "超尿素量" + ','+ "超量金额" + ','+ "处理状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveExceedOilDateDAO.getDriveExceedOilDate(params,function(error,rows){
        if (error) {
            logger.error(' getDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.yMonth = params.yMonth;
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
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else{
                    parkObj.operateType = "外协";
                }
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                if(rows[i].id == null){
                    if(rows[i].plan_oil == null){
                        parkObj.planOilTotal = "";
                    }else{
                        parkObj.planOilTotal = rows[i].plan_oil;
                    }
                    if(rows[i].actual_oil == null){
                        parkObj.actualOilTotal = "";
                    }else{
                        parkObj.actualOilTotal = rows[i].actual_oil;
                    }
                    if(rows[i].plan_urea == null){
                        parkObj.planUreaTotal = "";
                    }else{
                        parkObj.planUreaTotal = rows[i].plan_urea;
                    }
                    if(rows[i].actual_urea == null){
                        parkObj.actualUreaTotal = "";
                    }else{
                        parkObj.actualUreaTotal = rows[i].actual_urea;
                    }
                }else{
                    if(rows[i].plan_oil_total == null){
                        parkObj.planOilTotal = "";
                    }else{
                        parkObj.planOilTotal = rows[i].plan_oil_total;
                    }
                    if(rows[i].actual_oil_total == null){
                        parkObj.actualOilTotal = "";
                    }else{
                        parkObj.actualOilTotal = rows[i].actual_oil_total;
                    }
                    if(rows[i].plan_urea_total == null){
                        parkObj.planUreaTotal = "";
                    }else{
                        parkObj.planUreaTotal = rows[i].plan_urea_total;
                    }
                    if(rows[i].actual_urea_total == null){
                        parkObj.actualUreaTotal = "";
                    }else{
                        parkObj.actualUreaTotal = rows[i].actual_urea_total;
                    }
                }

                if(rows[i].surplus_oil == null){
                    parkObj.surplusOil = "";
                }else{
                    parkObj.surplusOil = rows[i].surplus_oil;
                }
                if(rows[i].surplus_urea == null){
                    parkObj.surplusUrea = "";
                }else{
                    parkObj.surplusUrea = rows[i].surplus_urea;
                }
                if(rows[i].subsidy_oil == null){
                    parkObj.subsidyOil = "";
                }else{
                    parkObj.subsidyOil = rows[i].subsidy_oil;
                }
                if(rows[i].subsidy_urea == null){
                    parkObj.subsidyUrea = "";
                }else{
                    parkObj.subsidyUrea = rows[i].subsidy_urea;
                }
                if(rows[i].exceed_oil == null){
                    parkObj.exceedOil = "";
                }else{
                    parkObj.exceedOil = rows[i].exceed_oil;
                }
                if(rows[i].exceed_urea == null){
                    parkObj.exceedUrea = "";
                }else{
                    parkObj.exceedUrea = rows[i].exceed_urea;
                }
                if(rows[i].actual_money == null){
                    parkObj.actualMoney = "";
                }else{
                    parkObj.actualMoney = rows[i].actual_money;
                }
                if(rows[i].check_status == 3){
                    parkObj.settleStatus = "已处理";
                }else if(rows[i].check_status == 2){
                    parkObj.settleStatus = "处理中";
                }else{
                    parkObj.settleStatus = "未处理";
                }
                csvString = csvString+parkObj.yMonth+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.operateType+","+
                    parkObj.companyName+","+ parkObj.planOilTotal+","+parkObj.actualOilTotal +","+parkObj.planUreaTotal+","+parkObj.actualUreaTotal+","+
                    parkObj.surplusOil+","+parkObj.surplusUrea +","+parkObj.subsidyOil+","+parkObj.subsidyUrea+","+
                    parkObj.exceedOil+","+parkObj.exceedUrea +","+parkObj.actualMoney+","+parkObj.settleStatus+ '\r\n';
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

function getDriveDpRouteTaskOilRelCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' + "司机" + ',' + "货车牌号" + ','+ "所属类型" + ','+"所属公司" + ','+
        "调度编号" + ','+ "起始城市" + ','+"目的城市"+','+ "计划执行时间" + ','+ "里程" + ','+ "油耗里程" + ','+
        "运载车辆数" + ','+"是否倒板" + ','+ "空(重)" + ','+ "百公里耗油量" + ','+ "百公里尿素" + ','+ "总耗油量"+ ','+ "总尿素";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskOilRelDAO.getDpRouteTaskOilRel(params,function(error,rows){
        if (error) {
            logger.error(' getDpRouteTaskOilRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.yMonth = params.yMonth;
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
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else{
                    parkObj.operateType = "外协";
                }
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                if(rows[i].dp_route_task_id == null){
                    parkObj.dpRouteTaskId = "";
                }else{
                    parkObj.dpRouteTaskId = rows[i].dp_route_task_id;
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
                if(rows[i].task_plan_date == null){
                    parkObj.taskPlanDate = "";
                }else{
                    parkObj.taskPlanDate = new Date(rows[i].task_plan_date).toLocaleDateString();
                }
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                if(rows[i].oil_distance == null){
                    parkObj.oilDistance = "";
                }else{
                    parkObj.oilDistance = rows[i].oil_distance;
                }
                if(rows[i].car_count == null){
                    parkObj.carCount = "";
                }else{
                    parkObj.carCount = rows[i].car_count;
                }
                if(rows[i].reverse_flag == 0){
                    parkObj.reverseFlag = "否";
                }else{
                    parkObj.reverseFlag = "是";
                }
                if(rows[i].load_flag == 0){
                    parkObj.loadFlag = "空";
                }else{
                    parkObj.loadFlag = "重";
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
                if(rows[i].total_oil == null){
                    parkObj.totalOil = "";
                }else{
                    parkObj.totalOil = rows[i].total_oil;
                }
                if(rows[i].total_urea == null){
                    parkObj.totalUrea = "";
                }else{
                    parkObj.totalUrea = rows[i].total_urea;
                }

                csvString = csvString+parkObj.yMonth+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.operateType+","+parkObj.companyName+","+
                    parkObj.dpRouteTaskId+","+parkObj.routeStart +","+parkObj.routeEnd+","+parkObj.taskPlanDate+","+
                    parkObj.distance+","+parkObj.oilDistance +","+parkObj.carCount+","+parkObj.reverseFlag+","+
                    parkObj.loadFlag+","+parkObj.oil +","+parkObj.urea+","+parkObj.totalOil+","+parkObj.totalUrea+ '\r\n';
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
    createDriveExceedOilDate : createDriveExceedOilDate,
    queryDriveExceedOilDate : queryDriveExceedOilDate,
    queryDriveExceedOilMonth : queryDriveExceedOilMonth,
    updateDriveExceedOilDate : updateDriveExceedOilDate,
    updateDriveExceedOilDateMoney : updateDriveExceedOilDateMoney,
    updateExceedOilDateCheckStatus : updateExceedOilDateCheckStatus,
    getDriveExceedOilDateCsv : getDriveExceedOilDateCsv,
    getDriveDpRouteTaskOilRelCsv : getDriveDpRouteTaskOilRelCsv
}
