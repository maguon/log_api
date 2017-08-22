/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteTaskDAO = require('../dao/DpRouteTaskDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTask.js');

function createDpRouteTask(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.taskPlanDate = myDate;
    dpRouteTaskDAO.addDpRouteTask(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteTask ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTask(req,res,next){
    var params = req.params ;
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


module.exports = {
    createDpRouteTask : createDpRouteTask,
    queryDpRouteTask : queryDpRouteTask
}