/**
 * Created by zwl on 2018/11/19.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteLoadTaskTmpDAO = require('../dao/DpRouteLoadTaskTmpDAO.js');
var dpDemandDAO = require('../dao/DpDemandDAO.js');
var dpTransferDemandDAO = require('../dao/DpTransferDemandDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskTmp.js');

function createDpRouteLoadTaskTmp(req,res,next){
    var params = req.params ;
    var planCount = 0;
    Seq().seq(function(){
        var that = this;
        if(params.loadTaskType==1){
            dpDemandDAO.getDpDemandBase({dpDemandId:params.dpDemandId},function(error,rows){
                if (error) {
                    logger.error(' getDpDemandBase ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else{
                    if(rows&&rows.length >0){
                        planCount = params.planCount+rows[0].plan_count;
                        if(planCount > rows[0].pre_count){
                            logger.warn(' getDpDemandBase ' + 'failed');
                            resUtil.resetFailedRes(res," 派发总数量不能大于指令数量 ");
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
        }else{
            dpTransferDemandDAO.getDpTransferDemand({transferDemandId:params.transferDemandId},function(error,rows){
                if (error) {
                    logger.error(' getDpTransferDemand ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else{
                    if(rows&&rows.length >0){
                        planCount = params.planCount+rows[0].plan_count;
                        if(planCount > rows[0].pre_count){
                            logger.warn(' getDpTransferDemand ' + 'failed');
                            resUtil.resetFailedRes(res," 派发总数量不能大于指令数量 ");
                            return next();
                        }else{
                            that();
                        }
                    }else{
                        logger.warn(' getDpTransferDemand ' + 'failed');
                        resUtil.resetFailedRes(res," 派发任务与调度中转需求不符合 ");
                        return next();
                    }
                }
            })
        }

    }).seq(function () {
        dpRouteLoadTaskTmpDAO.addDpRouteLoadTaskTmp(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteLoadTaskTmp ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteLoadTaskTmp ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }else{
                    resUtil.resetFailedRes(res," 创建任务失败 ");
                    return next();
                }
            }
        })
    })
}

function queryDpRouteLoadTaskTmp(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskTmpDAO.getDpRouteLoadTaskTmp(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskTmp ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskTmp ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDpRouteLoadTaskTmp(req,res,next){
    var params = req.params;
    dpRouteLoadTaskTmpDAO.deleteDpRouteLoadTaskTmp(params,function(error,result){
        if (error) {
            logger.error(' removeDpRouteLoadTaskTmp ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDpRouteLoadTaskTmp ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteLoadTaskTmp : createDpRouteLoadTaskTmp,
    queryDpRouteLoadTaskTmp : queryDpRouteLoadTaskTmp,
    removeDpRouteLoadTaskTmp : removeDpRouteLoadTaskTmp
}
