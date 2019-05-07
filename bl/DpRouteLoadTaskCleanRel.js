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
    }else{
        params.actualPrice = 0;
        params.actualGuardFee = 0;
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
    var header = "洗车编号" + ',' + "调度编号" + ',' + "司机" + ','+ "电话" + ','+ "品牌"+ ','+ "单价" + ','+ "洗车数" + ','+ "计划洗车费" + ','+
        "实际洗车费" + ','+ "计划门卫费" + ','+ "实际门卫费"+ ','+ "货车牌号" + ','+ "送达经销商"+ ','+ "装车日期" + ','+ "领取时间" + ','+ "领取状态";
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
                parkObj.driveName = rows[i].drive_name;
                parkObj.mobile = rows[i].mobile;
                parkObj.makeName = rows[i].make_name;
                parkObj.singlePrice = rows[i].single_price;
                parkObj.carCount = rows[i].car_count;
                if(rows[i].total_price==null){
                    parkObj.totalPrice = "";
                }else{
                    parkObj.totalPrice = rows[i].total_price;
                }
                if(rows[i].actual_price==null){
                    parkObj.actualPrice = "";
                }else{
                    parkObj.actualPrice = rows[i].actual_price;
                }
                if(rows[i].guard_fee==null){
                    parkObj.guardFee = "";
                }else{
                    parkObj.guardFee = rows[i].guard_fee;
                }
                if(rows[i].actual_guard_fee==null){
                    parkObj.actualGuardFee = "";
                }else{
                    parkObj.actualGuardFee = rows[i].actual_guard_fee;
                }
                parkObj.truckNum = rows[i].truck_num;
                parkObj.shortName = rows[i].short_name;
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
                csvString = csvString+parkObj.id+","+parkObj.dpRouteTaskId+","+parkObj.driveName+","+parkObj.mobile+","+parkObj.makeName+","+
                    parkObj.singlePrice+","+parkObj.carCount+","+parkObj.totalPrice+","+parkObj.actualPrice+","+parkObj.guardFee+","+
                    parkObj.actualGuardFee+","+parkObj.truckNum+","+parkObj.shortName+","+parkObj.loadDate+","+parkObj.cleanDate+","+
                    parkObj.status+ '\r\n';
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
