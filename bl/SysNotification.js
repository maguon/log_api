/**
 * Created by yym on 2020/12/28.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var sysNotificationDAO = require('../dao/SysNotificationDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SysNotification.js');

function createSysNotification(req,res,next){
    var params = req.params;
    params.userId = params.user;
    sysNotificationDAO.addSysNotification(params,function(error,result){
        if (error) {
            logger.error(' createSysNotification ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createSysNotification ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function querySysNotification(req,res,next){
    var params = req.params ;
    sysNotificationDAO.getSysNotification(params,function(error,result){
        if (error) {
            logger.error(' querySysNotification ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySysNotification ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateSysNotification(req,res,next){
    var params = req.params ;
    sysNotificationDAO.updateSysNotificationStatus(params,function(error,result){
        if (error) {
            logger.error(' updateSysNotification ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateSysNotification ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    createSysNotification : createSysNotification,
    querySysNotification : querySysNotification,
    updateSysNotification : updateSysNotification
}