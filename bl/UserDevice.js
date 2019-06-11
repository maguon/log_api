/**
 * Created by zwl on 2017/9/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var userDeviceDAO = require('../dao/UserDeviceDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDevice.js');

function createUserDevice(req,res,next){
    var params = req.params ;
    userDeviceDAO.addUserDevice(params,function(error,result){
        if (error) {
            logger.error(' createUserDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createUserDevice ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryUserDevice(req,res,next){
    var params = req.params ;
    userDeviceDAO.getUserDevice(params,function(error,result){
        if (error) {
            logger.error(' queryUserDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryUserDevice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateUserDeviceToken (req,res,next){
    var params = req.params;
    userDeviceDAO.updateUserDeviceToken(params,function(error,result){
        if (error) {
            logger.error(' updateUserDeviceToken ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateUserDeviceToken ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeUserDevice (req,res,next){
    var params = req.params;
    userDeviceDAO.deleteUserDevice(params,function(error,result){
        if (error) {
            logger.error(' removeUserDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeUserDevice ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createUserDevice : createUserDevice,
    queryUserDevice : queryUserDevice,
    updateUserDeviceToken : updateUserDeviceToken,
    removeUserDevice : removeUserDevice
}