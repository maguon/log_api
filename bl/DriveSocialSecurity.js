/**
 * Created by zwl on 2019/5/10.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveSocialSecurityDAO = require('../dao/DriveSocialSecurityDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSocialSecurity.js');

function createDriveSocialSecurity(req,res,next){
    var params = req.params ;
    var driveFlag  = true;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        driveSocialSecurityDAO.getDriveSocialSecurity(params,function(error,rows){
            if (error) {
                logger.error(' getDriveSocialSecurity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    parkObj.id = rows[0].id;
                    driveFlag = false;
                }else{
                    driveFlag = true;
                }
                that();
            }
        })
    }).seq(function(){
        if(driveFlag){
            driveSocialSecurityDAO.addDriveSocialSecurity(params,function(error,result){
                if (error) {
                    logger.error(' createDriveSocialSecurity ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' createDriveSocialSecurity ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        }else{
            driveSocialSecurityDAO.updateDriveSocialSecurity(params,function(error,result){
                if (error) {
                    logger.error(' updateDriveSocialSecurity ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' updateDriveSocialSecurity ' + 'success');
                    resUtil.resetQueryRes(res,{id:parkObj.id},null);
                    return next();
                }
            })
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