/**
 * Created by zwl on 2017/8/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckDispatchDAO = require('../dao/TruckDispatchDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDispatch.js');

function queryTruckDispatch(req,res,next){
    var params = req.params ;
    truckDispatchDAO.getTruckDispatch(params,function(error,result){
        if (error) {
            logger.error(' queryTruckDispatch ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckDispatch ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckDispatchStop(req,res,next){
    var params = req.params ;
    truckDispatchDAO.getTruckDispatchStop(params,function(error,result){
        if (error) {
            logger.error(' queryTruckDispatchStop ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckDispatchStop ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckDispatchLoadTask(req,res,next){
    var params = req.params ;
    truckDispatchDAO.getTruckDispatchLoadTask(params,function(error,result){
        if (error) {
            logger.error(' queryTruckDispatchLoadTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckDispatchLoadTask ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckDispatchCount(req,res,next){
    var params = req.params ;
    truckDispatchDAO.getTruckDispatchCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckDispatchCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckDispatchCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckDisCount(req,res,next){
    var params = req.params ;
    truckDispatchDAO.getTruckDisCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckDisCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckDisCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function initTruckDispatchCity(req,res,next){
    var params = req.params ;
    params.taskStart = 0;
    params.taskEnd = 0;
    truckDispatchDAO.updateTruckDispatch(params,function(error,result){
        if (error) {
            logger.error(' initTruckDispatchCity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' initTruckDispatchCity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    queryTruckDispatch: queryTruckDispatch ,
    queryTruckDispatchStop : queryTruckDispatchStop,
    queryTruckDispatchLoadTask : queryTruckDispatchLoadTask,
    queryTruckDispatchCount : queryTruckDispatchCount,
    queryTruckDisCount : queryTruckDisCount,
    initTruckDispatchCity : initTruckDispatchCity
}
