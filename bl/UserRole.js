/**
 * Created by zwl on 2017/3/10.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var userRoleDAO = require('../dao/UserRoleDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserRole.js');

function createUserRole(req,res,next){
    var params = req.params ;
    userRoleDAO.addUserRole(params,function(error,result){
        if (error) {
            logger.error(' createUserRole ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createUserRole ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryUserRole(req,res,next){
    var params = req.params ;
    userRoleDAO.getUserRole(params,function(error,result){
        if (error) {
            logger.error(' queryUserRole ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryUserRole ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createUserRole : createUserRole,
    queryUserRole : queryUserRole
}