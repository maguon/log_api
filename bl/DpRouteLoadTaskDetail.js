/**
 * Created by zwl on 2017/8/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteLoadTaskDetailDAO = require('../dao/DpRouteLoadTaskDetailDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDetail.js');

function createDpRouteLoadTaskDetail(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskDetailDAO.addDpRouteLoadTaskDetail(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteLoadTaskDetail ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteLoadTaskDetail ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskDetail(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskDetailDAO.getDpRouteLoadTaskDetail(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskDetail ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskDetail ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteLoadTaskDetailStatus(req,res,next){
    var params = req.params;
    dpRouteLoadTaskDetailDAO.updateDpRouteLoadTaskDetailStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteLoadTaskDetailStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteLoadTaskDetailStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteLoadTaskDetail : createDpRouteLoadTaskDetail,
    queryDpRouteLoadTaskDetail : queryDpRouteLoadTaskDetail,
    updateDpRouteLoadTaskDetailStatus : updateDpRouteLoadTaskDetailStatus
}
