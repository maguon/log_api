/**
 * Created by zwl on 2017/8/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');
var dpDemandDAO = require('../dao/DpDemandDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTask.js');

function createDpRouteLoadTask(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        dpDemandDAO.getDpDemandBase({dpDemandId:params.dpDemandId},function(error,rows){
            if (error) {
                logger.error(' getDpDemandBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    if(params.planCount > rows[0].pre_count){
                        logger.warn(' getDpDemandBase ' + 'failed');
                        resUtil.resetFailedRes(res," 派发数量不能大于指令数量 ");
                        return next();
                    }else{
                        that();
                    }
                }else{
                    logger.warn(' getDpDemandBase ' + 'failed');
                    resUtil.resetFailedRes(res," 派发任务与调度需求不符合 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        dpRouteLoadTaskDAO.addDpRouteLoadTask(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteLoadTask ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createDpRouteLoadTask ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDpRouteLoadTask(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskDAO.getDpRouteLoadTask(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTask ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteLoadTaskStatus(req,res,next){
    var params = req.params;
    dpRouteLoadTaskDAO.updateDpRouteLoadTaskStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteLoadTaskStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteLoadTaskStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeDpRouteLoadTask(req,res,next){
    var params = req.params;
    params.loadTaskStatus = sysConst.LOAD_TASK_STATUS.cancel;
    dpRouteLoadTaskDAO.updateDpRouteLoadTaskStatus(params,function(error,result){
        if (error) {
            logger.error(' removeDpRouteLoadTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDpRouteLoadTask ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteLoadTask : createDpRouteLoadTask,
    queryDpRouteLoadTask : queryDpRouteLoadTask,
    updateDpRouteLoadTaskStatus : updateDpRouteLoadTaskStatus,
    removeDpRouteLoadTask : removeDpRouteLoadTask
}
