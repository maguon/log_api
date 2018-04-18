/**
 * Created by zwl on 2018/4/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveSalaryTaskRelDAO = require('../dao/DriveSalaryTaskRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryTaskRel.js');

function createDriveSalaryTaskRelAll(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        var dpRouteTaskIds = params.dpRouteTaskIds;
        var rowArray = [] ;
        rowArray.length= dpRouteTaskIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                driveSalaryId : params.driveSalaryId,
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
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createDriveSalaryTaskRelAll ' + 'success');
        resUtil.resetQueryRes(res,{driveSalaryId:params.driveSalaryId},null);
        return next();
    })
}

function createDriveSalaryTaskRel(req,res,next){
    var params = req.params ;
    driveSalaryTaskRelDAO.addDriveSalaryTaskRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "调度编号已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createDriveSalaryTaskRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createDriveSalaryTaskRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSalaryTaskRel(req,res,next){
    var params = req.params ;
    driveSalaryTaskRelDAO.getDriveSalaryTaskRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryTaskRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryTaskRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveSalaryTaskRel(req,res,next){
    var params = req.params;
    driveSalaryTaskRelDAO.deleteDriveSalaryTaskRel(params,function(error,result){
        if (error) {
            logger.error(' removeDriveSalaryTaskRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDriveSalaryTaskRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveSalaryTaskRelAll : createDriveSalaryTaskRelAll,
    createDriveSalaryTaskRel : createDriveSalaryTaskRel,
    queryDriveSalaryTaskRel : queryDriveSalaryTaskRel,
    removeDriveSalaryTaskRel : removeDriveSalaryTaskRel
}
