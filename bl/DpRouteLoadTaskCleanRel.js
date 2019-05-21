/**
 * Created by zwl on 2018/1/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteLoadTaskCleanRelDAO = require('../dao/DpRouteLoadTaskCleanRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskCleanRel.js');

function createDpRouteLoadTaskCleanRel(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.addDpRouteLoadTaskCleanRel(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteLoadTaskCleanRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteLoadTaskCleanRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRel(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRel(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRelMonthStat(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRelMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRelMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRelMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRelReceiveMonthStat(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRelReceiveMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRelReceiveMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRelReceiveMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRelWeekStat(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRelWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRelWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRelWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRelReceiveWeekStat(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRelReceiveWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRelReceiveWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRelReceiveWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteLoadTaskCleanRel(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRel({loadTaskCleanRelId:params.loadTaskCleanRelId},function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTaskCleanRel ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].status != sysConst.CLEAN_STATUS.completed){
                    that();
                }else{
                    logger.warn(' getDpRouteLoadTaskCleanRel ' + 'failed');
                    resUtil.resetFailedRes(res," 洗车费已领取，不能进行修改 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        dpRouteLoadTaskCleanRelDAO.updateDpRouteLoadTaskCleanRel(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteLoadTaskCleanRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpRouteLoadTaskCleanRel ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateDpRouteLoadTaskCleanRelStatus(req,res,next){
    var params = req.params;
    if(params.status==sysConst.CLEAN_STATUS.completed){
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.cleanDate = myDate;
    }
    dpRouteLoadTaskCleanRelDAO.updateDpRouteLoadTaskCleanRelStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteLoadTaskCleanRelStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteLoadTaskCleanRelStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCleanRelStatus(req,res,next){
    var params = req.params;
    if(params.status==sysConst.CLEAN_STATUS.completed){
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.cleanDate = myDate;
    }
    dpRouteLoadTaskCleanRelDAO.updateCleanRelStatus(params,function(error,result){
        if (error) {
            logger.error(' updateCleanRelStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCleanRelStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getDpRouteLoadTaskCleanRelCsv(req,res,next){
    var csvString = "";
    var header = "洗车编号" + ',' + "调度编号" + ',' + "司机" + ','+ "电话" + ','+ "小车单价" + ','+ "大车单价" + ','+ "小车台数" + ','+
        "大车台数" + ','+ "洗车数" + ','+"洗车费" + ','+ "拖车费" + ','+ "提车费"+ ','+ "地跑费单价" + ','+ "地跑费总价"+ ','+"带路费"+ ','+
        "货车牌号" + ','+ "送达经销商"+ ','+ "品牌"+ ','+ "装车日期" + ','+ "领取时间" + ','+ "领取状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRel(params,function(error,rows){
        if (error) {
            logger.error(' queryDamage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.dpRouteTaskId = rows[i].dp_route_task_id;
                if(rows[i].drive_name==null){
                    parkObj.driveName = "";
                }else{
                    parkObj.driveName = rows[i].drive_name;
                }
                if(rows[i].mobile==null){
                    parkObj.mobile = "";
                }else{
                    parkObj.mobile = rows[i].mobile;
                }
                if(rows[i].small_single_price==null){
                    parkObj.smallSinglePrice = "";
                }else{
                    parkObj.smallSinglePrice = rows[i].small_single_price;
                }
                if(rows[i].big_single_price==null){
                    parkObj.bigSinglePrice = "";
                }else{
                    parkObj.bigSinglePrice = rows[i].big_single_price;
                }
                parkObj.smallCarCount = rows[i].small_car_count;
                parkObj.bigCarCount = rows[i].big_car_count;
                parkObj.carCount = rows[i].car_count;
                if(rows[i].total_price==null){
                    parkObj.totalPrice = "";
                }else{
                    parkObj.totalPrice = rows[i].total_price;
                }
                if(rows[i].total_trailer_fee==null){
                    parkObj.totalTrailerFee = "";
                }else{
                    parkObj.totalTrailerFee = rows[i].total_trailer_fee;
                }
                if(rows[i].car_parking_fee==null){
                    parkObj.carParkingFee = "";
                }else{
                    parkObj.carParkingFee = rows[i].car_parking_fee;
                }
                if(rows[i].run_fee==null){
                    parkObj.runFee = "";
                }else{
                    parkObj.runFee = rows[i].run_fee;
                }
                if(rows[i].total_run_fee==null){
                    parkObj.totalRunFee = "";
                }else{
                    parkObj.totalRunFee = rows[i].total_run_fee;
                }
                if(rows[i].lead_fee==null){
                    parkObj.leadFee = "";
                }else{
                    parkObj.leadFee = rows[i].lead_fee;
                }
                if(rows[i].truck_num==null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                parkObj.shortName = rows[i].short_name;
                if(rows[i].make_name==null){
                    parkObj.makeName = "";
                }else{
                    parkObj.makeName = rows[i].make_name;
                }
                if(rows[i].load_date==null){
                    parkObj.loadDate = "";
                }else{
                    parkObj.loadDate = new Date(rows[i].load_date).toLocaleDateString();
                }
                if(rows[i].clean_date==null){
                    parkObj.cleanDate = "";
                }else{
                    parkObj.cleanDate = new Date(rows[i].clean_date).toLocaleDateString();
                }
                if(rows[i].status == 0){
                    parkObj.status = "未通过";
                }else if(rows[i].status == 1){
                    parkObj.status = "未领取";
                }else{
                    parkObj.status = "已领取";
                }
                csvString = csvString+parkObj.id+","+parkObj.dpRouteTaskId+","+parkObj.driveName+","+parkObj.mobile+","+
                    parkObj.smallSinglePrice+","+parkObj.bigSinglePrice+","+parkObj.smallCarCount+","+parkObj.bigCarCount+","+ parkObj.carCount+","+
                    parkObj.totalPrice+","+parkObj.totalTrailerFee+","+ parkObj.carParkingFee+","+parkObj.runFee+","+parkObj.totalRunFee+","+parkObj.leadFee+","+
                    parkObj.truckNum+","+parkObj.shortName+","+parkObj.makeName+","+parkObj.loadDate+","+parkObj.cleanDate+","+ parkObj.status+ '\r\n';
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
    createDpRouteLoadTaskCleanRel : createDpRouteLoadTaskCleanRel,
    queryDpRouteLoadTaskCleanRel : queryDpRouteLoadTaskCleanRel,
    queryDpRouteLoadTaskCleanRelMonthStat : queryDpRouteLoadTaskCleanRelMonthStat,
    queryDpRouteLoadTaskCleanRelReceiveMonthStat : queryDpRouteLoadTaskCleanRelReceiveMonthStat,
    queryDpRouteLoadTaskCleanRelWeekStat : queryDpRouteLoadTaskCleanRelWeekStat,
    queryDpRouteLoadTaskCleanRelReceiveWeekStat : queryDpRouteLoadTaskCleanRelReceiveWeekStat,
    updateDpRouteLoadTaskCleanRel : updateDpRouteLoadTaskCleanRel,
    updateDpRouteLoadTaskCleanRelStatus : updateDpRouteLoadTaskCleanRelStatus,
    updateCleanRelStatus : updateCleanRelStatus,
    getDpRouteLoadTaskCleanRelCsv : getDpRouteLoadTaskCleanRelCsv
}
