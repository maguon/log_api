/**
 * Created by zwl on 2017/9/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var userDeviceDAO = require('../dao/UserDeviceDAO.js');
var userDAO = require('../dao/UserDAO.js');
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

function updateDeviceUpdatedOn(req,res,next){
    var params = req.params;
    var tokenObj = oAuthUtil.parseAccessToken(params.token);
    if(tokenObj){
        if(params.userId==tokenObj.userId){
            var subParams ={
                userId : params.userId,
                sa : 0,
                status : listOfValue.USER_STATUS_ACTIVE,
            }
            userDAO.getUser(subParams,function (error,rows) {
                if (error) {
                    logger.error(' changeUserToken ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(rows && rows.length<1){
                        logger.warn(' changeUserToken ' + params.userId+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                        resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_USER_UNREGISTERED) ;
                        return next();
                    }else{
                        var user = {
                            userId : rows[0].uid,
                            userStatus : rows[0].status,
                            type : rows[0].type,
                            name : rows[0].real_name,
                            phone: rows[0].mobile
                        }
                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);
                        oAuthUtil.removeToken({accessToken:params.token},function(error,result){
                            if(error) {
                                logger.error(' changeUserToken ' + error.stack);
                            }
                        })
                        oAuthUtil.saveToken(user,function(error,result){
                            if(error){
                                logger.error(' changeUserToken ' + error.stack);
                                //return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                            }
/*                            else{
                                logger.info(' changeUserToken' +params.userId+ " success");
                                resUtil.resetQueryRes(res,user,null);
                                return next();
                            }*/
                        })
                        var myDate = new Date();
                        params.updatedOn = myDate;
                        userDeviceDAO.updateDeviceUpdatedOn(params,function(error,result){
                            if(error){
                                logger.error(' changeUserToken ' + error.stack);
                                return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                            }else{
                                logger.info(' changeUserToken' +params.userId+ " success");
                                resUtil.resetQueryRes(res,user,null);
                                return next();
                            }
                        })
                    }
                }
            })
        }else{
            logger.warn(' changeUserToken' +params.userId+ " failed");
            resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR) ;
            return next();
        }
    }else{
        logger.warn(' changeUserToken' +params.userId+ " failed");
        resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR) ;
        return next();
    }
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
    updateDeviceUpdatedOn : updateDeviceUpdatedOn,
    removeUserDevice : removeUserDevice
}