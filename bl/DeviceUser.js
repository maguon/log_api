/**
 * Created by zwl on 2017/9/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var deviceUserDAO = require('../dao/DeviceUserDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DeviceUser.js');

function createDeviceUser(req,res,next){
    var params = req.params ;
    deviceUserDAO.addDeviceUser(params,function(error,result){
        if (error) {
            logger.error(' createDeviceUser ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDeviceUser ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDeviceUser(req,res,next){
    var params = req.params ;
    deviceUserDAO.getDeviceUser(params,function(error,result){
        if (error) {
            logger.error(' queryDeviceUser ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDeviceUser ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDeviceUser (req,res,next){
    var params = req.params;
    deviceUserDAO.deleteDeviceUser(params,function(error,result){
        if (error) {
            logger.error(' removeDeviceUser ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDeviceUser ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDeviceUser : createDeviceUser,
    queryDeviceUser : queryDeviceUser,
    removeDeviceUser : removeDeviceUser
}