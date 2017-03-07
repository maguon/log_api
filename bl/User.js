/**
 * Created by zwl on 2017/3/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var userDAO = require('../dao/UserDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('User.js');

function userRegister(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        userDAO.getUser({email:params.email},function(error,rows){
            if (error) {
                logger.error(' addUser ' + error.message);
                //res.send(200,{success:false,errMsg:sysMsg.SYS_INTERNAL_ERROR_MSG});
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' addUser ' +params.phone||params.email+ sysMsg.CUST_SIGNUP_REGISTERED);
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
                logger.error(' addUser ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result && result.insertId>0){
                    logger.info(' addUser ' + 'success');
                    var user = {
                        userId : result.insertId,
                        userStatus : listOfValue.USER_STATUS_ACTIVE
                    }
                    user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);

                    resUtil.resetQueryRes(res,user,null);
                }else{
                    logger.warn(' addUser ' + 'false');
                    //res.send(200,  {success:false,errMsg:sysMsg.SYS_INTERNAL_ERROR_MSG});
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
                return next();
            }
        })
    })
}

module.exports = {
    userRegister : userRegister
}