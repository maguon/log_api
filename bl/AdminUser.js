var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var encrypt = require('../util/Encrypt.js');
var resUtil = require('../util/ResponseUtil.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var adminUserDao = require('../dao/AdminUserDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var Seq = require('seq');
var logger = serverLogger.createLogger('Admin.js');

function adminUserLogin(req,res,next){
    var params = req.params;
    params.type = sysConst.USER_TYPE.admin;
    adminUserDao.queryAdminUser(params,function(error,rows){
        if (error) {
            logger.error(' adminUserLogin ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            if(rows && rows.length<1){
                logger.warn(' adminUserLogin ' +params.mobile+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                return next();
            }else{
                var passwordMd5 = encrypt.encryptByMd5(params.password);
                if(passwordMd5 != rows[0].password){
                    logger.warn(' adminUserLogin ' +params.mobile+ sysMsg.CUST_LOGIN_PSWD_ERROR);
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
                    if(rows[0].status == listOfValue.ADMIN_USER_STATUS_NOT_ACTIVE){
                        //Admin User status is not verified return user id

                        logger.info('adminUserLogin' +params.mobile+ " not verified");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }else{
                        //admin user status is active,return token

                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.admin,user.userId,user.userStatus);
                        oAuthUtil.saveToken(user,function(error,result){
                            if(error){
                                logger.error(' adminUserLogin ' + error.stack);
                                return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                            }else{
                                logger.info('adminUserLogin' +params.mobile+ " success");
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

function getAdminUserInfo(req,res,next){
    var params = req.params;
    adminUserDao.queryAdminBase(params,function(error,rows){
        if (error) {
            logger.error(' getAdminUserInfo ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getAdminUserInfo ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}


module.exports = {
    adminUserLogin : adminUserLogin,
    getAdminUserInfo  : getAdminUserInfo
}