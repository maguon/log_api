/**
 * Created by zwl on 2018/11/19.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var dpRouteTaskTmpDAO = require('../dao/DpRouteTaskTmpDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskTmp.js');

function createDpRouteTaskTmp(req,res,next){
    var params = req.params ;
    dpRouteTaskTmpDAO.addDpRouteTaskTmp(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteTaskTmp ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteTaskTmp ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskTmp(req,res,next){
    var params = req.params ;
    dpRouteTaskTmpDAO.getDpRouteTaskTmp(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskTmp ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskTmp ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDpRouteTaskTmp(req,res,next){
    var params = req.params;
    dpRouteTaskTmpDAO.deleteDpRouteTaskTmp(params,function(error,result){
        if (error) {
            logger.error(' removeDpRouteTaskTmp ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDpRouteTaskTmp ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteTaskTmp : createDpRouteTaskTmp,
    queryDpRouteTaskTmp : queryDpRouteTaskTmp,
    removeDpRouteTaskTmp : removeDpRouteTaskTmp
}