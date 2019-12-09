/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteTaskDAO = require('../dao/DpRouteTaskDAO.js');
var dpRouteTaskTmpDAO = require('../dao/DpRouteTaskTmpDAO.js');
var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');
var dpRouteLoadTaskTmpDAO = require('../dao/DpRouteLoadTaskTmpDAO.js');
var dpRouteTaskOilRelDAO = require('../dao/DpRouteTaskOilRelDAO.js');
var truckDispatchDAO = require('../dao/TruckDispatchDAO.js');
var dpRouteTaskLoanRelDAO = require('../dao/DpRouteTaskLoanRelDAO.js');
var dpRouteTaskRelDAO = require('../dao/DpRouteTaskRelDAO.js');
var cityRouteDAO = require('../dao/CityRouteDAO.js');
var carDAO = require('../dao/CarDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteTask.js');

function createDpRouteTask(req,res,next){
    var params = req.params ;
    var parkObj = {};
    var dpRouteTaskId = 0;
    Seq().seq(function() {
        var that = this;
        truckDAO.getTruckBase({truckId:params.truckId}, function (error, rows) {
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows&&rows.length>0) {
                    parkObj.operateType=rows[0].operate_type;
                    that();
                } else {
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        if(params.taskStatus==null||params.taskStatus==""){
            params.taskStatus = sysConst.TASK_STATUS.ready_accept;
        }else{
            var myDate = new Date();
            var strDate = moment(myDate).format('YYYYMMDD');
            params.taskStartDate = myDate;
            params.taskEndDate = myDate;
            params.dateId = parseInt(strDate);
        }
        if(params.reverseFlag == null || params.reverseFlag == ""){
            params.reverseFlag = 0;
            params.reverseMoney = 0;

        }
        if(parkObj.operateType==1){
            params.outerFlag = 0;
        }else{
            params.outerFlag = 1;
        }
        dpRouteTaskDAO.addDpRouteTask(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTask ' + 'success');
                    dpRouteTaskId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create dpRouteTask failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.dpRouteTaskId = dpRouteTaskId;
        dpRouteTaskRelDAO.addDpRouteTaskRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "调度编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDpRouteTaskRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTaskRel ' + 'success');
                }else{
                    logger.warn(' createDpRouteTaskRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDpRouteTask ' + 'success');
        req.params.routeContent =" 生成路线 ";
        req.params.routeId = dpRouteTaskId;
        req.params.routeOp =sysConst.RECORD_OP_TYPE.create;
        resUtil.resetCreateRes(res,{insertId:dpRouteTaskId},null);
        return next();
    })
}

function createEmptyDpRouteTask(req,res,next){
    var params = req.params ;
    var parkObj = {};
    var dpRouteTaskId = 0;
    Seq().seq(function() {
        var that = this;
        truckDAO.getTruckFirst({truckId:params.truckId}, function (error, rows) {
            if (error) {
                logger.error(' getTruckFirst ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows&&rows.length>0) {
                    parkObj.noLoadDistanceOil=rows[0].no_load_distance_oil;
                    parkObj.urea=rows[0].urea;
                    parkObj.operateType=rows[0].operate_type;
                    that();
                } else {
                    parkObj.noLoadDistanceOil=0;
                    parkObj.urea=0;
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        if(params.taskStatus==null||params.taskStatus==""){
            params.taskStatus = sysConst.TASK_STATUS.ready_accept;
        }else{
            var myDate = new Date();
            var strDate = moment(myDate).format('YYYYMMDD');
            params.taskStartDate = myDate;
            params.taskEndDate = myDate;
            params.dateId = parseInt(strDate);
        }
        if(params.reverseFlag == null || params.reverseFlag == ""){
            params.reverseFlag = 0;
            params.reverseMoney = 0;
        }
        if(parkObj.operateType==1){
            params.outerFlag = 0;
        }else{
            params.outerFlag = 1;
        }
        dpRouteTaskDAO.addDpRouteTask(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTask ' + 'success');
                    dpRouteTaskId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create dpRouteTask failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.dpRouteTaskId = dpRouteTaskId;
        dpRouteTaskRelDAO.addDpRouteTaskRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "调度编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDpRouteTaskRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTaskRel ' + 'success');
                }else{
                    logger.warn(' createDpRouteTaskRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function() {
        var that = this;
        if(parkObj.operateType==1){
            var subParams ={
                dpRouteTaskId:params.dpRouteTaskId,
                truckId:params.truckId,
                driveId:params.driveId,
                routeId:params.routeId,
                routeStartId:params.routeStartId,
                routeStart:params.routeStart,
                routeEndId:params.routeEndId,
                routeEnd:params.routeEnd,
                oil:parkObj.noLoadDistanceOil,
                totalOil: (params.oilDistance*parkObj.noLoadDistanceOil)/100,
                urea:parkObj.urea,
                totalUrea :(params.oilDistance*parkObj.urea)/100
            }
            dpRouteTaskOilRelDAO.addDpRouteTaskOilRel(subParams, function (error, result) {
                if (error) {
                    logger.error(' addDpRouteTaskOilRel ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.insertId > 0) {
                        logger.info(' addDpRouteTaskOilRel ' + 'success');
                    } else {
                        logger.warn(' addDpRouteTaskOilRel ' + 'failed');
                    }
                    that();
                }
            })
        }else{
            that();
        }
    }).seq(function(){
        logger.info(' createEmptyDpRouteTask ' + 'success');
        req.params.routeContent =" 生成路线 ";
        req.params.routeId = dpRouteTaskId;
        req.params.routeOp =sysConst.RECORD_OP_TYPE.create;
        resUtil.resetCreateRes(res,{insertId:dpRouteTaskId},null);
        return next();
    })
}

function createDpRouteTaskBatch(req,res,next){
    var params = req.params ;
    var dpRouteTaskId = 0;
    var cityRouteId = 0;
    Seq().seq(function(){
        var that = this;
        var subParams ={
            routeStartId : params.routeStartId,
            routeEndId : params.routeEndId
        }
        cityRouteDAO.getCityRoute(subParams,function(error,rows){
            if (error) {
                logger.error(' getCityRoute ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    cityRouteId = rows[0].id;
                    that();
                }else{
                    logger.warn(' getCityRoute ' + 'failed');
                    resUtil.resetFailedRes(res," 此路线未设置。 ");
                    return next();

                }
            }
        })
    }).seq(function(){
        var that = this;
        if(params.taskStatus==null||params.taskStatus==""){
            params.taskStatus = sysConst.TASK_STATUS.ready_accept;
        }
        if(params.reverseFlag == null || params.reverseFlag == ""){
            params.reverseFlag = 0;
            params.reverseMoney = 0;
        }
        dpRouteTaskDAO.addDpRouteTask(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteTaskBatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTaskBatch ' + 'success');
                    dpRouteTaskId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create dpRouteTask failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.dpRouteTaskId = dpRouteTaskId;
        params.cityRouteId = cityRouteId;
        dpRouteTaskRelDAO.addDpRouteTaskRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "调度编号已经被关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDpRouteTaskRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTaskRel ' + 'success');
                }else{
                    logger.warn(' createDpRouteTaskRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        params.dpRouteTaskId = dpRouteTaskId;
        dpRouteLoadTaskDAO.addDpRouteLoadTaskBatch(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteLoadTaskBatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteLoadTaskBatch ' + 'success');
                }else{
                    logger.warn(' createDpRouteLoadTaskBatch ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        dpRouteTaskTmpDAO.deleteDpRouteTaskTmp(params,function(error,result){
            if (error) {
                logger.error(' deleteDpRouteTaskTmp ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' deleteDpRouteTaskTmp ' + 'success');
                }else{
                    logger.warn(' deleteDpRouteTaskTmp ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        dpRouteLoadTaskTmpDAO.deleteDpRouteLoadTaskTmp(params,function(error,result){
            if (error) {
                logger.error(' deleteDpRouteLoadTaskTmp ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' deleteDpRouteLoadTaskTmp ' + 'success');
                }else{
                    logger.warn(' deleteDpRouteLoadTaskTmp ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDpRouteTaskBatch ' + 'success');
        req.params.routeContent =" 生成路线 ";
        req.params.routeId = dpRouteTaskId;
        req.params.routeOp =sysConst.RECORD_OP_TYPE.create;
        resUtil.resetCreateRes(res,{insertId:dpRouteTaskId},null);
        return next();
    })
}

function queryDpRouteTask(req,res,next){
    var params = req.params ;
    if(params.dateIdStart !=null || params.dateIdStart !=""){
        var dateIdStart = params.dateIdStart;
        var d = new Date(dateIdStart);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdStart = parseInt(currentDateStr);
    }
    if(params.dateIdEnd !=null || params.dateIdEnd !=""){
        var dateIdEnd = params.dateIdEnd;
        var d = new Date(dateIdEnd);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdEnd = parseInt(currentDateStr);
    }
    dpRouteTaskDAO.getDpRouteTask(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTask ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskList(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getDpRouteTaskList(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskBase(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getDpRouteTaskBase(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function  queryDpRouteTaskBaseCsv(req,res,next) {
    var csvString = "";
    var header = "调度编号" + ',' + "线路" + ',' + "公里数"+ ',' + "货车" + ','+ "实际装车商品车数量" + ','+ "板车位数" +','+
        "单价" + ','+ "重载/空载" + ','+ "倒板"+ ','+ "倒板工资" + ','+ "完成时间" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskDAO.getDpRouteTaskBase(params,function(error,rows){
        if (error) {
            logger.error(' queryDpRouteTaskBaseCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;//调度编号
                parkObj.route = rows[i].route_start+'-'+rows[i].route_end;//线路
                parkObj.distance = rows[i].distance;//公里数
                parkObj.truckNum = rows[i].truck_num + '('+ rows[i].brand_name + ')';//货车
                //运输车辆
                parkObj.carCount = rows[i].car_count;//实际装车商品车数量
                parkObj.truckNumber = rows[i].truck_number;//板车位数
                //单价
                if(rows[i].truck_number == 6){

                    if(rows[i].car_count<=3){
                        parkObj.mileageSalary=0.6;
                    }
                    else if(rows[i].car_count==4){
                        parkObj.mileageSalary =0.7;
                    }
                    else if(rows[i].car_count==5){
                        parkObj.mileageSalary =0.8;
                    }
                    else if(rows[i].car_count==6){
                        parkObj.mileageSalary =0.9;
                    }
                    else if(rows[i].car_count>=7){
                        parkObj.mileageSalary =1;
                    }
                }
                else if(rows[i].truck_number == 8){
                    if(rows[i].car_count<=4){
                        parkObj.mileageSalary=0.6;
                    }
                    else if(rows[i].car_count==5){
                        parkObj.mileageSalary =0.7;
                    }
                    else if(rows[i].car_count==6){
                        parkObj.mileageSalary =0.8;
                    }
                    else if(rows[i].car_count==7){
                        parkObj.mileageSalary =0.9;
                    }
                    else if(rows[i].car_count==8){
                        parkObj.mileageSalary =1.0;
                    }
                    else if(rows[i].car_count==9){
                        parkObj.mileageSalary =1.1;
                    }
                    else if(rows[i].car_count>=10){
                        parkObj.mileageSalary =1.2;
                    }
                }
                else {
                    parkObj.mileageSalary =0
                }
                //重载/空载
                if(rows[i].load_flag == 0){
                    parkObj.loadFlag = "空载";
                }else if(rows[i].load_flag == 1) {
                    parkObj.loadFlag = "重载";
                }
                //倒板
                if(rows[i].reverse_flag == 0){
                    parkObj.reverseFlag = "否";
                }else if(rows[i].reverse_flag == 1) {
                    parkObj.reverseFlag = "是";
                }
                parkObj.reverseMoney = rows[i].reverse_money;//倒板工资
                //完成时间
                if(rows[i].task_end_date == null){
                    parkObj.taskEndDate = "";
                }else{
                    parkObj.taskEndDate = new Date(rows[i].task_end_date).toLocaleDateString();
                }
                csvString = csvString+parkObj.id+","+parkObj.route+","+parkObj.distance+"," +parkObj.truckNum+","+ parkObj.carCount+","+
                    parkObj.truckNumber+","+parkObj.mileageSalary +","+parkObj.loadFlag+","+
                    parkObj.reverseFlag+"," +parkObj.reverseMoney+"," +parkObj.taskEndDate+'\r\n';
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

function queryDriveDistanceMoney(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getDriveDistanceMoney(params,function(error,result){
        if (error) {
            logger.error(' queryDriveDistanceMoney ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveDistanceMoney ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveDistanceCount(req,res,next){
    var params = req.params ;
    if(params.dateIdStart !=null || params.dateIdStart !=""){
        var dateIdStart = params.dateIdStart;
        var d = new Date(dateIdStart);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdStart = parseInt(currentDateStr);
    }
    if(params.dateIdEnd !=null || params.dateIdEnd !=""){
        var dateIdEnd = params.dateIdEnd;
        var d = new Date(dateIdEnd);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdEnd = parseInt(currentDateStr);
    }
    dpRouteTaskDAO.getDriveDistanceCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveDistanceCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveDistanceCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveDistanceLoadStat(req,res,next){
    var params = req.params ;
    if(params.dateIdStart !=null || params.dateIdStart !=""){
        var dateIdStart = params.dateIdStart;
        var d = new Date(dateIdStart);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdStart = parseInt(currentDateStr);
    }
    if(params.dateIdEnd !=null || params.dateIdEnd !=""){
        var dateIdEnd = params.dateIdEnd;
        var d = new Date(dateIdEnd);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdEnd = parseInt(currentDateStr);
    }
    dpRouteTaskDAO.getDriveDistanceLoadStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveDistanceLoadStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveDistanceLoadStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveDistanceLoad(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getDriveDistanceLoad(params,function(error,result){
        if (error) {
            logger.error(' queryDriveDistanceLoad ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveDistanceLoad ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryNotCompletedTaskStatusCount(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getNotCompletedTaskStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryNotCompletedTaskStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryNotCompletedTaskStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTaskStatusCount(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getTaskStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryTaskStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTaskStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskStatus(req,res,next){
    var params = req.params;
    var parkObj = {};
    Seq().seq(function() {
        var that = this;
        dpRouteTaskDAO.getDpRouteTask({dpRouteTaskId:params.dpRouteTaskId}, function (error, rows) {
                if (error) {
                    logger.error(' getDpRouteTask ' + error.message);
                    resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    if (rows && rows.length > 0) {
                        parkObj.truckId=rows[0].truck_id;
                        parkObj.driveId=rows[0].drive_id;
                        parkObj.routeId=rows[0].route_id;
                        parkObj.routeStartId=rows[0].route_start_id;
                        parkObj.routeStart=rows[0].route_start;
                        parkObj.routeEndId=rows[0].route_end_id;
                        parkObj.routeEnd=rows[0].route_end;
                        parkObj.distance=rows[0].distance;
                        parkObj.oilDistance=rows[0].oil_distance;
                        parkObj.loadDistanceOil=rows[0].load_distance_oil;
                        parkObj.noLoadDistanceOil=rows[0].no_load_distance_oil;
                        parkObj.urea=rows[0].urea;
                        parkObj.loadReverseOil=rows[0].load_reverse_oil;
                        parkObj.noLoadReverseOil=rows[0].no_load_reverse_oil;
                        parkObj.reverseFlag=rows[0].reverse_flag;
                        parkObj.outerFlag=rows[0].outer_flag;
                        that();
                    } else {
                        logger.warn(' getDpRouteTask ' + 'failed');
                        resUtil.resetFailedRes(res, " 指令路线已被删除 ");
                        return next();
                    }
                }
            })
    }).seq(function() {
        var that = this;
        if (params.taskStatus == sysConst.TASK_STATUS.on_road) {
            params.loadTaskStatus = sysConst.LOAD_TASK_STATUS.no_load;
            dpRouteLoadTaskDAO.getDpRouteLoadTaskBase(params, function (error, rows) {
                if (error) {
                    logger.error(' getDpRouteLoadTaskBase ' + error.message);
                    resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    if (rows && rows.length > 0) {
                        logger.warn(' getDpRouteLoadTaskBase ' + 'failed');
                        resUtil.resetFailedRes(res, " 未完成装车任务，状态不可为在途 ");
                        return next();
                    } else {
                        that();
                    }
                }
            })
        }else if(params.taskStatus == sysConst.TASK_STATUS.completed){
            dpRouteTaskDAO.getDpRouteTask({dpRouteTaskId:params.dpRouteTaskId},function(error,rows){
                if (error) {
                    logger.error(' getDpRouteTask ' + error.message);
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    parkObj.carCount = rows[0].car_count;
                    parkObj.truckNumber = rows[0].truck_number;
                    that();
                }
            })
        }else{
            that();
        }
    }).seq(function() {
        var that = this;
            if (params.taskStatus == sysConst.TASK_STATUS.completed) {
            var subParams ={
                currentCity:parkObj.routeEndId,
                taskStart:0,
                taskEnd:0,
                truckId:parkObj.truckId
            }
            truckDispatchDAO.updateTruckDispatch(subParams, function (error, result) {
                if (error) {
                    logger.error(' updateTruckDispatch ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateTruckDispatch ' + 'success');
                    } else {
                        logger.warn(' updateTruckDispatch ' + 'failed');
                    }
                    that();
                }
            });
        }else{
            that();
        }
    }).seq(function() {
        var that = this;
        if (params.taskStatus == sysConst.TASK_STATUS.completed) {
            if(parkObj.outerFlag == sysConst.OUTER_FLAG.no){
                if(parkObj.carCount>=4){
                    parkObj.loadFlag = sysConst.LOAD_FLAG.loan;
                }else{
                    parkObj.loadFlag = sysConst.LOAD_FLAG.not_loan;
                }
                if(parkObj.loadFlag==sysConst.LOAD_FLAG.loan){
                    parkObj.oil = parkObj.loadDistanceOil;
                    parkObj.reverseOil = parkObj.loadReverseOil;
                    parkObj.totalOil = (parkObj.oilDistance*parkObj.loadDistanceOil)/100;
                    parkObj.totalUrea = (parkObj.oilDistance*parkObj.urea)/100;
                    parkObj.totalReverseOil = (parkObj.oilDistance*parkObj.loadReverseOil)/100;
                    if(parkObj.reverseFlag==1){
                        parkObj.totalOil = parkObj.totalOil+parkObj.totalReverseOil;
                    }
                }else{
                    parkObj.oil = parkObj.noLoadDistanceOil;
                    parkObj.reverseOil = parkObj.noLoadReverseOil;
                    parkObj.totalOil = (parkObj.oilDistance*parkObj.noLoadDistanceOil)/100;
                    parkObj.totalUrea = (parkObj.oilDistance*parkObj.urea)/100;
                    parkObj.totalReverseOil = (parkObj.oilDistance*parkObj.noLoadReverseOil)/100;
                    if(parkObj.reverseFlag==1){
                        parkObj.totalOil = parkObj.totalOil+parkObj.totalReverseOil;
                    }
                }
                var subParams ={
                    dpRouteTaskId:params.dpRouteTaskId,
                    truckId:parkObj.truckId,
                    driveId:parkObj.driveId,
                    routeId:parkObj.routeId,
                    routeStartId:parkObj.routeStartId,
                    routeStart:parkObj.routeStart,
                    routeEndId:parkObj.routeEndId,
                    routeEnd:parkObj.routeEnd,
                    oil:parkObj.oil,
                    totalOil:parkObj.totalOil,
                    urea:parkObj.urea,
                    totalUrea:parkObj.totalUrea,
                    reverseOil:parkObj.reverseOil,
                    totalReverseOil:parkObj.totalReverseOil
                }
                dpRouteTaskOilRelDAO.addDpRouteTaskOilRel(subParams, function (error, result) {
                    if (error) {
                        logger.error(' addDpRouteTaskOilRel ' + error.message);
                        throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if (result && result.insertId > 0) {
                            logger.info(' addDpRouteTaskOilRel ' + 'success');
                        } else {
                            logger.warn(' addDpRouteTaskOilRel ' + 'failed');
                        }
                        that();
                    }
                })
            }else{
                //根据dp_route_task 查出外协名称，同时更新车辆外协公司ID
                var subParams ={
                    dpRouteTaskId:params.dpRouteTaskId,
                    truckId:parkObj.truckId,
                }
                carDAO.updateCarCompanyId(subParams,function(error,result){
                    if (error) {
                        logger.error(' updateCompletedCar ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if (result && result.affectedRows > 0) {
                            logger.info(' updateCarCompanyId ' + 'success');
                        } else {
                            logger.warn(' updateCarCompanyId ' + 'failed');
                        }
                        that();
                    }
                })
            }

        }else{
            that();
        }
    }).seq(function () {
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        if(params.taskStatus == sysConst.TASK_STATUS.doing){
            params.taskStartDate = myDate;
        }
        if(params.taskStatus == sysConst.TASK_STATUS.completed){
            params.taskEndDate = myDate;
            params.dateId = parseInt(strDate);
            if(parkObj.carCount>=4){
                params.loadFlag = sysConst.LOAD_FLAG.loan;
                params.oilLoadFlag = sysConst.OIL_LOAD_FLAG.loan;
            }
        }
        dpRouteTaskDAO.updateDpRouteTaskStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteTaskStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpRouteTaskStatus ' + 'success');
                if(params.taskStatus==sysConst.TASK_STATUS.accept){
                    req.params.routeContent =" 接受指令 ";
                    req.params.routeId = params.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.accept;
                }
                if(params.taskStatus==sysConst.TASK_STATUS.doing){
                    req.params.routeContent =" 执行指令 ";
                    req.params.routeId = params.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.doing;
                }
                if(params.taskStatus==sysConst.TASK_STATUS.on_road){
                    req.params.routeContent =" 装车完成，货车在途 ";
                    req.params.routeId = params.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.on_road;
                }
                if(params.taskStatus==sysConst.TASK_STATUS.completed){
                    req.params.routeContent =" 全部送达，任务完成 ";
                    req.params.routeId = params.dpRouteTaskId;
                    req.params.routeOp = sysConst.RECORD_OP_TYPE.completed;
                    dpRouteTaskDAO.finishDpRouteTask(params, function (error, result) {
                        if (error) {
                            logger.error(' updateTruckDispatch ' + error.message);
                            throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                        } else {
                            if (result && result.affectedRows > 0) {
                                logger.info(' updateTruckDispatch ' + 'success');
                            } else {
                                logger.warn(' updateTruckDispatch ' + 'failed');
                            }
                        }
                    });
                }
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });

    })
}

function updateDpRouteTaskStatusBack(req,res,next){
    var params = req.params;
    var parkObj = {};
    Seq().seq(function() {
        var that = this;
        dpRouteTaskDAO.getDpRouteTask({dpRouteTaskId:params.dpRouteTaskId}, function (error, rows) {
            if (error) {
                logger.error(' getDpRouteTask ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows && rows.length > 0) {
                    parkObj.distance=rows[0].distance;
                    that();
                } else {
                    logger.warn(' getDpRouteTask ' + 'failed');
                    resUtil.resetFailedRes(res, " 指令路线已被删除 ");
                    return next();
                }
            }
        })
    }).seq(function() {
        var that = this;
        truckDispatchDAO.getTruckDispatch({truckId:params.truckId}, function (error, rows) {
            if (error) {
                logger.error(' getTruckDispatch ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows && rows.length > 0) {
                    parkObj.current_city=rows[0].current_city;
                    parkObj.taskStart=rows[0].task_start;
                    parkObj.taskEnd=rows[0].task_end;
                    that();
                } else {
                    logger.warn(' getTruckDispatch ' + 'failed');
                    resUtil.resetFailedRes(res, " 货车不存在,任务回退失败 ");
                    return next();
                }
            }
        })
    }).seq(function() {
        var that = this;
        dpRouteTaskDAO.updateDpRouteTaskStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteTaskStatusBack ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if (result && result.affectedRows > 0) {
                    logger.info(' updateDpRouteTaskStatusBack ' + 'success');
                    that();
                } else {
                    logger.warn(' updateDpRouteTaskStatusBack ' + 'failed');
                    resUtil.resetFailedRes(res," 任务回退失败 ");
                    return next();
                }
            }
        })
    }).seq(function() {
        var that = this;
        params.carCount = 0;
        dpRouteTaskDAO.updateDpRouteTaskCarCount(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteTaskCarCount ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if (result && result.affectedRows > 0) {
                    logger.info(' updateDpRouteTaskCarCount ' + 'success');
                } else {
                    logger.warn(' updateDpRouteTaskCarCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function() {
        var that = this;
        params.oilDistance = parkObj.distance;
        params.oilLoadFlag = sysConst.OIL_LOAD_FLAG.not_loan;
        dpRouteTaskDAO.updateDpRouteOilLoadFlag(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteOilLoadFlag ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if (result && result.affectedRows > 0) {
                    logger.info(' updateDpRouteOilLoadFlag ' + 'success');
                } else {
                    logger.warn(' updateDpRouteOilLoadFlag ' + 'failed');
                }
                that();
            }
        })
    }).seq(function() {
        var subParams ={
            currentCity:parkObj.taskStart,
            taskStart:0,
            taskEnd:0,
            truckId:params.truckId
        }
        truckDispatchDAO.updateTruckDispatch(subParams, function (error, result) {
            if (error) {
                logger.error(' updateTruckDispatch ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckDispatch ' + 'success');
                req.params.routeContent =" 在途调整为执行 ";
                req.params.routeId = params.dpRouteTaskId;
                req.params.routeOp = sysConst.RECORD_OP_TYPE.on_road_back;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function removeDpRouteTask(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskDAO.getDpRouteLoadTask(params,function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    logger.warn(' getDpRouteLoadTask ' + 'failed');
                    resUtil.resetFailedRes(res," 请先删除该段路线任务，在删除路线。 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        dpRouteTaskLoanRelDAO.deleteDpRouteTaskLoanRelAll(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTaskLoanRelAll ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDpRouteTaskLoanRelAll ' + 'success');
                }else{
                    logger.warn(' removeDpRouteTaskLoanRelAll ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        dpRouteTaskRelDAO.deleteDpRouteTaskRel(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTaskRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDpRouteTaskRel ' + 'success');
                }else{
                    logger.warn(' removeDpRouteTaskRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        params.taskStatus = sysConst.TASK_STATUS.cancel;
        dpRouteTaskDAO.updateDpRouteTaskStatus(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' removeDpRouteTask ' + 'success');
                req.params.routeContent =" 取消路线 ";
                req.params.routeId = params.dpRouteTaskId;
                req.params.routeOp =sysConst.RECORD_OP_TYPE.cancel;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryRouteTaskWeekStat(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getRouteTaskWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryRouteTaskWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRouteTaskWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryRouteTaskMonthStat(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getRouteTaskMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryRouteTaskMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRouteTaskMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryRouteTaskDayStat(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getRouteTaskDayStat(params,function(error,result){
        if (error) {
            logger.error(' queryRouteTaskDayStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRouteTaskDayStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDpRouteTaskCsv(req,res,next){
    var csvString = "";
    var header = "调度编号" + ',' + "路线" + ',' + "里程"+ ',' + "司机" + ','+ "身份证号" + ','+
        "货车牌号" + ','+ "货车电话" + ','+ "计划装车数"+ ','+ "实际装车数" + ','+ "计划执行时间" + ','+ "完成时间"
        + ','+ "调度人" + ','+ "状态"+ ','+ "备注" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskDAO.getDpRouteTask(params,function(error,rows){
        if (error) {
            logger.error(' queryDpRouteTaskCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.route = rows[i].route_start+'-'+rows[i].route_end;
                parkObj.distance = rows[i].distance;
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].id_number == null){
                    parkObj.idNumber = "";
                }else{
                    parkObj.idNumber = rows[i].id_number;
                }
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].truck_tel == null){
                    parkObj.truckTel = "";
                }else{
                    parkObj.truckTel = rows[i].truck_tel;
                }
                if(rows[i].plan_count == null){
                    parkObj.planCount = "";
                }else{
                    parkObj.planCount = rows[i].plan_count;
                }
                if(rows[i].real_count == null){
                    parkObj.realCount = "";
                }else{
                    parkObj.realCount = rows[i].real_count;
                }
                parkObj.taskPlanDate = new Date(rows[i].task_plan_date).toLocaleDateString();
                if(rows[i].task_end_date == null){
                    parkObj.taskEndDate = "";
                }else{
                    parkObj.taskEndDate = new Date(rows[i].task_end_date).toLocaleDateString();
                }
                parkObj.routeOpName = rows[i].route_op_name;
                if(rows[i].task_status == 1){
                    parkObj.taskStatus = "待接受";
                }else if(rows[i].task_status == 2){
                    parkObj.taskStatus = "接受";
                }else if(rows[i].task_status == 3){
                    parkObj.taskStatus = "执行";
                }else if(rows[i].task_status == 4){
                    parkObj.taskStatus = "在途";
                }else if(rows[i].task_status == 8){
                    parkObj.taskStatus = "取消安排";
                }else if(rows[i].task_status == 9){
                    parkObj.taskStatus = "已完成";
                }else{
                    parkObj.taskStatus = "全部完成";
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                csvString = csvString+parkObj.id+","+parkObj.route+","+parkObj.distance+"," +parkObj.driveName+","+
                    parkObj.idNumber+","+parkObj.truckNum+","+parkObj.truckTel+","+
                    parkObj.planCount+"," +parkObj.realCount+"," +parkObj.taskPlanDate+","+parkObj.taskEndDate+","+parkObj.routeOpName+","+
                    parkObj.taskStatus+","+parkObj.remark+ '\r\n';
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

function getDriveDistanceLoadStatCsv(req,res,next){
    var csvString = "";
    var header = "司机" + ',' +"货车牌号" + ',' + "所属类型"+ ',' +"完成任务数" + ',' + "倒板数" + ',' +
        "空载油量公里数" + ','+"重载油量公里数" + ','+ "空载公里数" + ','+"重载公里数" + ','+"总计里程"+ ',' + "重载率(%)" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    if(params.dateIdStart !=null || params.dateIdStart !=""){
        var dateIdStart = params.dateIdStart;
        var d = new Date(dateIdStart);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdStart = parseInt(currentDateStr);
    }
    if(params.dateIdEnd !=null || params.dateIdEnd !=""){
        var dateIdEnd = params.dateIdEnd;
        var d = new Date(dateIdEnd);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdEnd = parseInt(currentDateStr);
    }
    dpRouteTaskDAO.getDriveDistanceLoadStat(params,function(error,rows){
        if (error) {
            logger.error(' getDriveDistanceLoadStatCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else{
                    parkObj.operateType = "外协";
                }
                parkObj.completeCount = rows[i].complete_count;
                if(rows[i].reverse_count == null){
                    parkObj.reverseCount = 0;
                }else{
                    parkObj.reverseCount = rows[i].reverse_count;
                }

                if(rows[i].no_oil_distance == null){
                    parkObj.noOilDistance = 0;
                }else{
                    parkObj.noOilDistance = rows[i].no_oil_distance;
                }
                if(rows[i].load_oil_distance == null){
                    parkObj.loadDistanceOil = 0;
                }else{
                    parkObj.loadDistanceOil = rows[i].load_oil_distance;
                }
                if(rows[i].no_load_distance == null){
                    parkObj.noLoadDistance = 0;
                }else{
                    parkObj.noLoadDistance = rows[i].no_load_distance;
                }
                if(rows[i].load_distance == null){
                    parkObj.loadDistance = 0;
                }else{
                    parkObj.loadDistance = rows[i].load_distance;
                }
                parkObj.totalDistance = rows[i].load_distance+rows[i].no_load_distance;
                parkObj.loadDistanceRate =rows[i].load_distance/(rows[i].load_distance+rows[i].no_load_distance)*100;

                csvString = csvString+parkObj.driveName+","+parkObj.truckNum+","+parkObj.operateType+","+
                    parkObj.completeCount+","+parkObj.reverseCount+","+parkObj.noOilDistance+","+parkObj.loadDistanceOil+","+
                    parkObj.noLoadDistance+","+parkObj.loadDistance+","+parkObj.totalDistance+","+parkObj.loadDistanceRate.toFixed(2) + '\r\n';
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

function getDriveDistanceLoadCsv(req,res,next){
    var csvString = "";
    var header = "司机" + ',' +"货车牌号" + ',' + "联系电话" + ',' + "调度编号"+ ',' + "计划执行时间" + ','+ "起始城市" + ','+ "目的城市"+ ','+
        "起始装车地" + ','+ "经销商" + ','+ "装载车辆" + ','+ "公里数"+ ','+
        "小车洗车费" + ','+ "大车洗车费" + ','+ "拖车费" + ','+ "地跑费" + ','+ "带路费";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskDAO.getDriveDistanceLoad(params,function(error,rows){
        if (error) {
            logger.error(' getDriveDistanceLoadStatCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                parkObj.mobile = rows[i].mobile;
                parkObj.id = rows[i].id;
                if(rows[i].task_plan_date == null){
                    parkObj.taskPlanDate = "";
                }else{
                    parkObj.taskPlanDate = new Date(rows[i].task_plan_date).toLocaleDateString();
                }
                parkObj.routeStart = rows[i].route_start;
                parkObj.routeEnd = rows[i].route_end;

                if(rows[i].addr_name == null){
                    parkObj.addrName = "";
                }else{
                    parkObj.addrName = rows[i].addr_name;
                }
                if(rows[i].short_name == null){
                    parkObj.shortName = "";
                }else{
                    parkObj.shortName = rows[i].short_name;
                }
                if(rows[i].real_count == null){
                    parkObj.realCount = "";
                }else{
                    parkObj.realCount = rows[i].real_count;
                }
                parkObj.distance = rows[i].distance;
                if(rows[i].clean_fee == null){
                    parkObj.cleanFee = "";
                }else{
                    parkObj.cleanFee = rows[i].clean_fee;
                }
                if(rows[i].big_clean_fee == null){
                    parkObj.bigCleanFee = "";
                }else{
                    parkObj.bigCleanFee = rows[i].big_clean_fee;
                }
                if(rows[i].trailer_fee == null){
                    parkObj.trailerFee = "";
                }else{
                    parkObj.trailerFee = rows[i].trailer_fee;
                }
                if(rows[i].run_fee == null){
                    parkObj.runFee = "";
                }else{
                    parkObj.runFee = rows[i].run_fee;
                }
                if(rows[i].lead_fee == null){
                    parkObj.leadFee = "";
                }else{
                    parkObj.leadFee = rows[i].lead_fee;
                }
                csvString = csvString+parkObj.driveName+","+parkObj.truckNum+","+parkObj.mobile+","+parkObj.id+"," +parkObj.taskPlanDate+","+
                    parkObj.routeStart+","+parkObj.routeEnd+","+parkObj.addrName+","+parkObj.shortName+","+parkObj.realCount+","+parkObj.distance+","+
                    parkObj.cleanFee+","+parkObj.bigCleanFee+","+parkObj.trailerFee+","+parkObj.runFee+"," +parkObj.leadFee+ '\r\n';
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

function updateDpRouteLoadFlag (req,res,next){
    var params = req.params;
    var parkObj = {};
    var loadFlag = "";
    Seq().seq(function() {
        var that = this;
        dpRouteTaskDAO.getDpRouteTask({dpRouteTaskId:params.dpRouteTaskId}, function (error, rows) {
            if (error) {
                logger.error(' getDpRouteTask ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows && rows.length > 0) {
                    parkObj.upDistanceCount=rows[0].up_distance_count;
                    that();
                } else {
                    logger.warn(' getDpRouteTask ' + 'failed');
                    resUtil.resetFailedRes(res, " 指令路线不存在 ");
                    return next();
                }
            }
        })
    }).seq(function() {
        var that = this;
        if(params.loadFlag==sysConst.LOAD_FLAG.not_loan){
            loadFlag = "空载";
        }else{
            loadFlag = "重载";
        }
        dpRouteTaskDAO.updateDpRouteLoadFlag(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteLoadFlag ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if (result && result.affectedRows > 0) {
                    logger.info(' updateDpRouteLoadFlag ' + 'success');
                    that();
                } else {
                    logger.warn(' updateDpRouteLoadFlag ' + 'failed');
                    resUtil.resetFailedRes(res," 修改结算里程失败 ");
                    return next();
                }
            }
        })
    }).seq(function() {
        parkObj.upDistanceCount = parkObj.upDistanceCount + 1;
        dpRouteTaskDAO.updateDistanceRecordCount(params, function (error, result) {
            if (error) {
                logger.error(' updateDistanceRecordCount ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDistanceRecordCount ' + 'success');
                req.params.routeContent =" 修改结算里程："+params.distance+"公里  "+params.carCount+"辆  "+loadFlag+" 倒板金额 "+params.reverseMoney+" 第"+parkObj.upDistanceCount+"次修改";
                req.params.routeId = params.dpRouteTaskId;
                req.params.routeOp =sysConst.RECORD_OP_TYPE.distance;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateDpRouteOilLoadFlag (req,res,next){
    var params = req.params;
    var parkObj = {};
    var oilLoadFlag = "";
    Seq().seq(function () {
        var that = this;
        dpRouteTaskDAO.getDpRouteTask({dpRouteTaskId:params.dpRouteTaskId}, function (error, rows) {
            if (error) {
                logger.error(' getDpRouteTask ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows && rows.length > 0) {
                    parkObj.loadDistanceOil=rows[0].load_distance_oil;
                    parkObj.noLoadDistanceOil=rows[0].no_load_distance_oil;
                    parkObj.upDistanceCount=rows[0].up_distance_count;
                    that();
                } else {
                    logger.warn(' getDpRouteTask ' + 'failed');
                    resUtil.resetFailedRes(res, " 指令路线不存在 ");
                    return next();
                }
            }
        })
        }).seq(function () {
            var that = this;
            if(params.oilLoadFlag==sysConst.OIL_LOAD_FLAG.not_loan){
                oilLoadFlag = "空载";
            }else{
                oilLoadFlag = "重载";
            }
            dpRouteTaskDAO.updateDpRouteOilLoadFlag(params,function(error,result){
                if (error) {
                    logger.error(' updateDpRouteOilLoadFlag ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateDpRouteOilLoadFlag ' + 'success');
                        that();
                    } else {
                        logger.warn(' updateDpRouteOilLoadFlag ' + 'failed');
                        resUtil.resetFailedRes(res," 修改结算里程失败 ");
                        return next();
                    }
                }
            })
    }).seq(function(){
        var that = this;
        if(params.oilLoadFlag==sysConst.OIL_LOAD_FLAG.loan){
            params.oil = parkObj.loadDistanceOil;
            params.totalOil = (params.oilDistance*parkObj.loadDistanceOil)/100;
        }else{
            params.oil = parkObj.noLoadDistanceOil;
            params.totalOil = (params.oilDistance*parkObj.noLoadDistanceOil)/100;
        }
        dpRouteTaskOilRelDAO.updateDpRouteTaskOilReltotalOil(params, function (error, result) {
            if (error) {
                logger.error(' updateDpRouteTaskOilReltotalOil ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if (result && result.affectedRows > 0) {
                    logger.info(' updateDpRouteTaskOilReltotalOil ' + 'success');
                } else {
                    logger.warn(' updateDpRouteTaskOilReltotalOil ' + 'failed');
                }
                that();
            }
        })
    }).seq(function() {
        parkObj.upDistanceCount = parkObj.upDistanceCount + 1;
        dpRouteTaskDAO.updateDistanceRecordCount(params, function (error, result) {
            if (error) {
                logger.error(' updateDistanceRecordCount ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDistanceRecordCount ' + 'success');
                req.params.routeContent =" 修改油耗里程："+params.oilDistance+"公里  "+oilLoadFlag+" 第"+parkObj.upDistanceCount+"次修改";
                req.params.routeId = params.dpRouteTaskId;
                req.params.routeOp =sysConst.RECORD_OP_TYPE.oil_distance;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateDpRouteReverseFlag (req,res,next){
    var params = req.params;
    if(params.reverseFlag==sysConst.REVERSE_FLAG.not_reverse){
        params.reverseMoney = 0;
    }
    dpRouteTaskDAO.updateDpRouteReverseFlag(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteReverseFlag ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteReverseFlag ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskRemark (req,res,next){
    var params = req.params;
    dpRouteTaskDAO.updateDpRouteTaskRemark(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskRemark ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskRemark ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveCost(req,res,next){
    var params = req.params ;
    dpRouteTaskDAO.getDriveCost(params,function(error,result){
        if (error) {
            logger.error(' queryDriveCost ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveCost ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDriveCostCsv(req,res,next){
    var csvString = "";
    var header = "司机" + ',' + "货车" + ',' +"洗车费" + ',' + "拖车费" + ','+ "提车费"+ ','+ "地跑费"+ ','+ "带路费" + ','+ "货车停车费"+ ','+
        "商品车停车费"+ ','+ "商品车加油费"+ ','+"其他费用"+ ','+ "货车油费" + ','+ "货车尿素费"+ ','+ "违章罚款司机" + ','+ "违章罚款公司"+ ','+ "过路费"+ ','+
        "质损个人" + ','+ "质损公司"+ ','+ "配件费" + ','+ "维修费"+ ','+ "保养费" + ','+ "货车事故个人"+ ','+ "货车事故公司";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskDAO.getDriveCost(params,function(error,rows){
        if (error) {
            logger.error(' getDriveCost ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].total_clean_fee == null){
                    parkObj.totalCleanFee = "";
                }else{
                    parkObj.totalCleanFee = rows[i].total_clean_fee;
                }
                if(rows[i].total_trailer_fee == null){
                    parkObj.totalTrailerFee = "";
                }else{
                    parkObj.totalTrailerFee = rows[i].total_trailer_fee;
                }
                if(rows[i].car_parking_fee == null){
                    parkObj.carParkingFee = "";
                }else{
                    parkObj.carParkingFee = rows[i].car_parking_fee;
                }
                if(rows[i].total_run_fee == null){
                    parkObj.totalRunFee = "";
                }else{
                    parkObj.totalRunFee = rows[i].total_run_fee;
                }
                if(rows[i].lead_fee == null){
                    parkObj.leadFee = "";
                }else{
                    parkObj.leadFee = rows[i].lead_fee;
                }
                if(rows[i].truck_parking_fee == null){
                    parkObj.truckParkingFee = "";
                }else{
                    parkObj.truckParkingFee = rows[i].truck_parking_fee;
                }
                if(rows[i].car_total_fee == null){
                    parkObj.carTotalFee = "";
                }else{
                    parkObj.carTotalFee = rows[i].car_total_fee;
                }
                if(rows[i].car_oil_fee == null){
                    parkObj.carOilFee = "";
                }else{
                    parkObj.carOilFee = rows[i].car_oil_fee;
                }
                if(rows[i].other_fee == null){
                    parkObj.otherFee = "";
                }else{
                    parkObj.otherFee = rows[i].other_fee;
                }
                if(rows[i].oil_fee == null){
                    parkObj.oilFee = "";
                }else{
                    parkObj.oilFee = rows[i].oil_fee;
                }
                if(rows[i].urea_fee == null){
                    parkObj.ureaFee = "";
                }else{
                    parkObj.ureaFee = rows[i].urea_fee;
                }
                if(rows[i].peccancy_under_fee == null){
                    parkObj.peccancyUnderFee = "";
                }else{
                    parkObj.peccancyUnderFee = rows[i].peccancy_under_fee;
                }
                if(rows[i].peccancy_company_fee == null){
                    parkObj.peccancyCompanyFee = "";
                }else{
                    parkObj.peccancyCompanyFee = rows[i].peccancy_company_fee;
                }
                if(rows[i].etc_fee == null){
                    parkObj.etcFee = "";
                }else{
                    parkObj.etcFee = rows[i].etc_fee;
                }
                if(rows[i].damage_under_fee == null){
                    parkObj.damageUnderFee = "";
                }else{
                    parkObj.damageUnderFee = rows[i].damage_under_fee;
                }
                if(rows[i].damage_company_fee == null){
                    parkObj.damageCompanyFee = "";
                }else{
                    parkObj.damageCompanyFee = rows[i].damage_company_fee;
                }
                if(rows[i].parts_fee == null){
                    parkObj.partsFee = "";
                }else{
                    parkObj.partsFee = rows[i].parts_fee;
                }
                if(rows[i].repair_fee == null){
                    parkObj.repairFee = "";
                }else{
                    parkObj.repairFee = rows[i].repair_fee;
                }
                if(rows[i].maintain_fee == null){
                    parkObj.maintainFee = "";
                }else{
                    parkObj.maintainFee = rows[i].maintain_fee;
                }
                if(rows[i].accident_under_fee == null){
                    parkObj.accidentUnderFee = "";
                }else{
                    parkObj.accidentUnderFee = rows[i].accident_under_fee;
                }
                if(rows[i].accident_company_fee == null){
                    parkObj.accidentCompanyFee = "";
                }else{
                    parkObj.accidentCompanyFee = rows[i].accident_company_fee;
                }
                csvString = csvString+parkObj.driveName+","+parkObj.truckNum+","+parkObj.totalCleanFee+","+parkObj.totalTrailerFee +","+
                    parkObj.carParkingFee+","+parkObj.totalRunFee+","+parkObj.leadFee +","+parkObj.truckParkingFee +","+parkObj.carTotalFee +","+
                    parkObj.carOilFee+","+parkObj.otherFee+","+parkObj.oilFee+","+parkObj.ureaFee+","+parkObj.peccancyUnderFee +","+parkObj.peccancyCompanyFee+","+
                    parkObj.etcFee+","+ parkObj.damageUnderFee+","+parkObj.damageCompanyFee+","+
                    parkObj.partsFee+","+parkObj.repairFee +","+parkObj.maintainFee+","+parkObj.accidentUnderFee+","+parkObj.accidentCompanyFee+ '\r\n';
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

function getDpRouteTaskDetailCsv(req,res,next){
    var csvString = "";
    var header = "调度编号"+ ','+"路线起始地"+ ','+"路线目的地"+ ','+"司机"+ ',' +"货车牌号"+ ',' +"计划执行时间"+ ',' +"VIN"+ ','+"委托方"+ ','+"品牌"+ ','+"起始城市"+ ','+
        "目的城市"+ ','+"经销商"+ ','+"车型";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskDAO.getDpRouteTaskDetail(params,function(error,rows){
        if (error) {
            logger.error(' getDriveSettle ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.dpRouteStart = rows[i].dp_route_start;
                parkObj.dpRouteEnd = rows[i].dp_route_end;
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].task_plan_date == null){
                    parkObj.taskPlanDate = "";
                }else{
                    parkObj.taskPlanDate = new Date(rows[i].task_plan_date).toLocaleDateString();
                }
                parkObj.vin = rows[i].vin;
                if(rows[i].short_name == null){
                    parkObj.shortName = "";
                }else{
                    parkObj.shortName = rows[i].short_name;
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
                if(rows[i].short_name == null){
                    parkObj.shortName = "";
                }else{
                    parkObj.shortName = rows[i].short_name;
                }
                if(rows[i].size_type == 0){
                    parkObj.sizeType = "小车";
                }else{
                    parkObj.sizeType = "大车";
                }
                csvString = csvString+parkObj.id+","+parkObj.dpRouteStart+","+parkObj.dpRouteEnd+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.taskPlanDate+","+
                    parkObj.vin+","+parkObj.shortName+","+parkObj.makeName+","+parkObj.routeStart +","+parkObj.routeEnd+","+
                    parkObj.shortName+","+parkObj.sizeType+ '\r\n';
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
    createDpRouteTask : createDpRouteTask,
    createEmptyDpRouteTask : createEmptyDpRouteTask,
    createDpRouteTaskBatch : createDpRouteTaskBatch,
    queryDpRouteTask : queryDpRouteTask,
    queryDpRouteTaskList : queryDpRouteTaskList,
    queryDpRouteTaskBase : queryDpRouteTaskBase,
    queryDpRouteTaskBaseCsv : queryDpRouteTaskBaseCsv,
    queryDriveDistanceMoney : queryDriveDistanceMoney,
    queryDriveDistanceCount : queryDriveDistanceCount,
    queryDriveDistanceLoadStat : queryDriveDistanceLoadStat,
    queryDriveDistanceLoad : queryDriveDistanceLoad,
    queryNotCompletedTaskStatusCount : queryNotCompletedTaskStatusCount,
    queryTaskStatusCount : queryTaskStatusCount,
    updateDpRouteTaskStatus : updateDpRouteTaskStatus,
    updateDpRouteTaskStatusBack : updateDpRouteTaskStatusBack,
    removeDpRouteTask : removeDpRouteTask ,
    queryRouteTaskDayStat : queryRouteTaskDayStat ,
    queryRouteTaskWeekStat : queryRouteTaskWeekStat ,
    queryRouteTaskMonthStat : queryRouteTaskMonthStat,
    getDpRouteTaskCsv : getDpRouteTaskCsv,
    getDriveDistanceLoadStatCsv : getDriveDistanceLoadStatCsv,
    getDriveDistanceLoadCsv : getDriveDistanceLoadCsv,
    updateDpRouteLoadFlag : updateDpRouteLoadFlag,
    updateDpRouteOilLoadFlag : updateDpRouteOilLoadFlag,
    updateDpRouteReverseFlag : updateDpRouteReverseFlag,
    updateDpRouteTaskRemark : updateDpRouteTaskRemark,
    queryDriveCost : queryDriveCost,
    getDriveCostCsv : getDriveCostCsv,
    getDpRouteTaskDetailCsv : getDpRouteTaskDetailCsv
}