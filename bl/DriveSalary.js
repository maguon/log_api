/**
 * Created by zwl on 2018/4/16.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var driveSalaryDAO = require('../dao/DriveSalaryDAO.js');
var driveSalaryTaskRelDAO = require('../dao/DriveSalaryTaskRelDAO.js');
var dpRouteTaskDAO = require('../dao/DpRouteTaskDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DriveSalary.js');

function createDriveSalaryTask(req,res,next){
    var params = req.params ;
    var driveSalaryId = 0;
    Seq().seq(function(){
        var that = this;
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMM');
        params.monthDateId = parseInt(strDate);
        driveSalaryDAO.addDriveSalary(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "本月司机已经存在，操作失败");
                    return next();
                } else{
                    logger.error(' createDriveSalaryTask ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDriveSalaryTask ' + 'success');
                    driveSalaryId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create driveSalaryTask failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var dpRouteTaskIds = params.dpRouteTaskIds;
        var rowArray = [] ;
        rowArray.length= dpRouteTaskIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                statStatus : sysConst.STAT_STATUS.stat,
                driveSalaryId : driveSalaryId,
                dpRouteTaskId : dpRouteTaskIds[i],
                row : i+1,
            }
            driveSalaryTaskRelDAO.addDriveSalaryTaskRel(subParams,function(err,result){
                if (err) {
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "调度编号已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createDriveSalaryTaskRelAll ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createDriveSalaryTaskRelAll ' + 'success');
                    }else{
                        logger.warn(' createDriveSalaryTaskRelAll ' + 'failed');
                    }
                    that(null,i);
                }
            })
            dpRouteTaskDAO.updateDpRouteStatStatus(subParams,function(error,result){
                if (error) {
                    logger.error(' updateDpRouteTaskStatus ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.affectedRows>0){
                        logger.info(' updateDpRouteTaskStatus ' + 'success');
                    }else{
                        logger.warn(' updateDpRouteTaskStatus ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            logger.info(' createDriveSalaryTask ' + 'success');
            resUtil.resetCreateRes(res,{insertId:driveSalaryId},null);
            return next();
        })
    })
}

function queryDriveSalary(req,res,next){
    var params = req.params;
    driveSalaryDAO.getDriveSalary(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalary ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDrivePlanSalary(req,res,next){
    var params = req.params;
    driveSalaryDAO.updateDrivePlanSalary(params,function(error,result){
        if (error) {
            logger.error(' updateDrivePlanSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDrivePlanSalary ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveActualSalary(req,res,next){
    var params = req.params;
    driveSalaryDAO.updateDriveActualSalary(params,function(error,result){
        if (error) {
            logger.error(' updateDriveActualSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveActualSalary ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveSalaryStatus(req,res,next){
    var params = req.params;
    driveSalaryDAO.updateDriveSalaryStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDriveSalaryStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveSalaryStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveSalaryTask : createDriveSalaryTask,
    queryDriveSalary : queryDriveSalary,
    updateDrivePlanSalary : updateDrivePlanSalary,
    updateDriveActualSalary : updateDriveActualSalary,
    updateDriveSalaryStatus : updateDriveSalaryStatus
}
