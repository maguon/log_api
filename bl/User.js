/**
 * Created by zwl on 2017/3/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var userDAO = require('../dao/UserDAO.js');
var userDeviceDAO = require('../dao/UserDeviceDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('User.js');

function createUser(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        userDAO.getUser({mobile:params.mobile},function(error,rows){
            if (error) {
                logger.error(' createUser ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' createUser ' +params.mobile+ sysMsg.CUST_SIGNUP_REGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.CUST_SIGNUP_REGISTERED) ;
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        params.password = encrypt.encryptByMd5(params.password);
        userDAO.addUser(params,function(error,result){
            if (error) {
                logger.error(' createUser ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result && result.insertId>0){
                    logger.info(' createUser ' + 'success');
                    var user = {
                        userId : result.insertId,
                        userStatus : listOfValue.USER_STATUS_ACTIVE
                    }
                    user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);
                    resUtil.resetQueryRes(res,user,null);
                }else{
                    logger.warn(' createUser ' + 'false');
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
                return next();
            }
        })
    })
}

function userLogin(req,res,next){
    var params = req.params;
    params.sa = 0;
    userDAO.getUser(params,function(error,rows){
        if (error) {
            logger.error(' userLogin ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            if(rows && rows.length<1){
                logger.warn(' userLogin ' + params.email||params.phone+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED) ;
                return next();
            }else{
                var passwordMd5 = encrypt.encryptByMd5(params.password);
                if(passwordMd5 != rows[0].password){
                    logger.warn(' userLogin ' +params.phone + ' ' + sysMsg.CUST_LOGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_PSWD_ERROR) ;
                    return next();
                }else{
                    var user = {
                        userId : rows[0].uid,
                        userStatus : rows[0].status,
                        type : rows[0].type,
                        name : rows[0].real_name,
                        phone: params.mobile
                    }
                    if(rows[0].status == listOfValue.USER_STATUS_NOT_ACTIVE){
                        //Admin User status is not verified return user id

                        logger.info('userLogin' +params.email||params.mobile+ " not actived");
                        resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR);
                        return next();
                    }else{
                        //admin user status is active,return token

                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);
                        oAuthUtil.saveToken(user,function(error,result){
                            if(error){
                                logger.error(' userLogin ' + error.stack);
                                return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                            }else{
                                logger.info(' userLogin' +params.mobile+ " success");
                                resUtil.resetQueryRes(res,user,null);
                                return next();
                            }
                        })

                    }
                }
            }
        }
    })
}

function mobileUserLogin(req,res,next){
    var params = req.params;
    var user ={};
    var newUserDeviceFlag = true;
    Seq().seq(function(){
        var that = this;
        params.sa = 0;
        userDAO.getUser(params,function(error,rows){
            if (error) {
                logger.error(' mobileUserLogin ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows && rows.length<1){
                    logger.warn(' mobileUserLogin ' + params.email||params.phone+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED) ;
                    return next();
                }else{
                    var passwordMd5 = encrypt.encryptByMd5(params.password);
                    if(passwordMd5 != rows[0].password){
                        logger.warn(' mobileUserLogin ' +params.phone+ sysMsg.CUST_LOGIN_PSWD_ERROR);
                        resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_PSWD_ERROR) ;
                        return next();
                    }else{
                        user = {
                            userId : rows[0].uid,
                            userStatus : rows[0].status,
                            type : rows[0].type,
                            name : rows[0].real_name,
                            phone: params.mobile
                        }
                        if(rows[0].status == listOfValue.USER_STATUS_NOT_ACTIVE){
                            logger.info('mobileUserLogin' +params.email||params.mobile+ " not actived");
                            resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR);
                            return next();
                        }else{
                            user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);
                            oAuthUtil.saveToken(user,function(error,result){
                                if(error){
                                    logger.error(' mobileUserLogin ' + error.stack);
                                    return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                                }else{
                                    logger.info(' mobileUserLogin' + " success");
                                    that();
                                }
                            })
                        }
                    }
                }
            }
        })
    }).seq(function () {
        var that = this;
        params.userId= user.userId;
        userDeviceDAO.getUserDevice(params, function (error, rows) {
            if (error) {
                logger.error(' getUserDevice ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows && rows.length > 0) {
                    newUserDeviceFlag = false;
                    that();
                } else {
                    that();
                }
            }
        })
    }).seq(function () {
        var that = this;
        if(newUserDeviceFlag) {
            params.userId= user.userId;
            userDeviceDAO.addUserDevice(params,function(error,result){
                if (error) {
                    logger.error(' addUserDevice ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' addUserDevice ' + 'success');
                    }else{
                        logger.warn(' addUserDevice ' + 'failed');
                    }
                    that();
                }
            })
        }else{
            var myDate = new Date();
            params.updatedOn = myDate;
            params.userId= user.userId;
            userDeviceDAO.updateUserDevice(params, function (error, result) {
                if (error) {
                    logger.error(' updateUserDevice ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateUserDevice ' + 'success');
                    } else {
                        logger.warn(' updateUserDevice ' + 'failed');
                    }
                    that();
                }
            })
        }
    }).seq(function(){
        logger.info(' mobileUserLogin' +params.mobile+ " success");
        resUtil.resetQueryRes(res,user,null);
        return next();
    })
}

function queryUser(req,res,next){
    var params = req.params ;
    userDAO.getUserBase(params,function(error,result){
        if (error) {
            logger.error(' queryUser ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryUser ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryUserDrive(req,res,next){
    var params = req.params ;
    userDAO.getUserDrive(params,function(error,result){
        if (error) {
            logger.error(' queryUserDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryUserDrive ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateUserInfo (req,res,next){
    var params = req.params;
    userDAO.updateUserInfo(params,function(error,result){
        if (error) {
            logger.error(' updateUserInfo ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateUserInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateUserStatus (req,res,next){
    var params = req.params;
    userDAO.updateUserStatus(params,function(error,result){
        if (error) {
            logger.error(' updateUserStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateUserStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function changeUserPassword(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        userDAO.getUser(params,function(error,rows){
            if (error) {
                logger.error(' changeUserPassword ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows && rows.length<1){
                    logger.warn(' changeUserPassword ' + sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    return next();
                }else if(encrypt.encryptByMd5(params.originPassword) != rows[0].password){
                    logger.warn(' changeUserPassword ' + sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res,sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        params.password = encrypt.encryptByMd5(params.newPassword);
        userDAO.updateUserPassword(params,function(error,result){
            if (error) {
                logger.error(' changeUserPassword ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' changeUserPassword ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function resetPassword(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        /*userDAO.getUser(params,function(error,rows){
            if (error) {
                logger.error(' resetPassword ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows && rows.length<1){
                    logger.warn(' resetPassword ' + sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    return next();
                }else{
                    that();
                }
            }
        })*/
        that();
    }).seq(function(){
        //check phone captcha
        var that = this;
        oAuthUtil.getPasswordCode({phone:params.mobile},function (error,result) {
            if (error) {
                logger.error(' resetPassword ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else if(result == null || result.result== null || params.captcha != result.result.code){
                logger.warn(' resetPassword ' + 'failed');
                resUtil.resetFailedRes(res,sysMsg.CUST_SMS_CAPTCHA_ERROR,null);
                return next();
            }else{
                that();
            }
        })
    }).seq(function(){
        params.password = encrypt.encryptByMd5(params.password);
        userDAO.updateUserPassword(params,function(error,result){
            if (error) {
                logger.error(' resetPassword ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' resetPassword ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function changeUserToken(req,res,next){
    var params = req.params;
    var tokenObj = oAuthUtil.parseAccessToken(params.token);
    if(tokenObj){
        if(params.userId==tokenObj.userId){
            userDAO.getUser({userId:params.userId},function (error,rows) {
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

function updateUserAvatarImage(req,res,next){
    var params = req.params;
    userDAO.updateUserAvatarImage(params,function(error,result){
        if (error) {
            logger.error(' updateUserAvatarImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateUserAvatarImage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateUserMobile(req,res,next){
    var params = req.params;
    var returnMsg;
    Seq().seq(function(){
        var that = this;
        userDAO.getUser({mobile:params.newMobile},function(error,rows){
            if (error) {
                logger.error(' updateUserMobile ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows && rows.length>0){
                    logger.warn(' updateUserMobile ' + sysMsg.CUST_SIGNUP_REGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.CUST_SIGNUP_REGISTERED);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        //check phone captcha
        var that = this;
        oAuthUtil.getPhoneCode({phone:params.newMobile},function (error,result) {
            if (error) {
                logger.error(' updateUserMobile ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else if(result == null || result.result== null || params.captcha != result.result.code){
                logger.warn(' updateUserMobile ' + 'failed');
                resUtil.resetFailedRes(res,sysMsg.CUST_SMS_CAPTCHA_ERROR,null);
                return next();
            }else{
                that();
            }
        })
        that();
    }).seq(function(){
        var that = this;
        userDAO.updateUserMobile(params,function(error,result){
            if (error) {
                logger.error(' updateUserMobile ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateUserMobile ' + 'success');
                returnMsg = result;
                that();
            }
        })
    }).seq(function(){
        if(params.newMobile){
            params.tel = params.newMobile;
        }
        driveDAO.updateDriveTel(params,function (error,result){
            if (error) {
                logger.error(' updateUserMobile ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateUserMobile ' + 'success');
                resUtil.resetUpdateRes(res,returnMsg,null);
                return next();
            }
        })
    })
}


module.exports = {
    createUser : createUser,
    userLogin : userLogin,
    mobileUserLogin : mobileUserLogin,
    queryUser : queryUser,
    queryUserDrive : queryUserDrive,
    updateUserInfo : updateUserInfo,
    updateUserStatus : updateUserStatus,
    changeUserPassword : changeUserPassword,
    resetPassword : resetPassword,
    changeUserToken : changeUserToken,
    updateUserAvatarImage : updateUserAvatarImage,
    updateUserMobile : updateUserMobile
}