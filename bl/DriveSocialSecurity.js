/**
 * Created by zwl on 2019/5/10.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveSocialSecurityDAO = require('../dao/DriveSocialSecurityDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSocialSecurity.js');
var csv=require('csvtojson');
var fs = require('fs');

function createDriveSocialSecurity(req,res,next){
    var params = req.params ;
    driveSocialSecurityDAO.addDriveSocialSecurity(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "此数据已存在，操作失败");
                return next();
            } else{
                logger.error(' createDriveSocialSecurity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createDriveSocialSecurity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSocialSecurity(req,res,next){
    var params = req.params ;
    driveSocialSecurityDAO.getDriveSocialSecurity(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSocialSecurity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSocialSecurity ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveSocialSecurity(req,res,next){
    var params = req.params ;
    driveSocialSecurityDAO.updateDriveSocialSecurity(params,function(error,result){
        if (error) {
            logger.error(' updateDriveSocialSecurity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveSocialSecurity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveSocialSecurity : createDriveSocialSecurity,
    queryDriveSocialSecurity : queryDriveSocialSecurity,
    updateDriveSocialSecurity : updateDriveSocialSecurity
}