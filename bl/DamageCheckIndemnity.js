/**
 * Created by zwl on 2018/3/2.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var damageCheckIndemnityDAO = require('../dao/DamageCheckIndemnityDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageCheckIndemnity.js');

function createDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.addDamageCheckIndemnity(params,function(error,result){
        if (error) {
            logger.error(' createDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDamageCheckIndemnity ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.getDamageCheckIndemnity(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheckIndemnity ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateDamageCheckIndemnity(params,function(error,result){
        if (error) {
            logger.error(' updateDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageCheckIndemnity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDamageCheckIndemnityImage(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateDamageCheckIndemnityImage(params,function(error,result){
        if (error) {
            logger.error(' updateDamageCheckIndemnityImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageCheckIndemnityImage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateIndemnity(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.indemnityDate = myDate;
    damageCheckIndemnityDAO.updateIndemnity(params,function(error,result){
        if (error) {
            logger.error(' updateIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateIndemnity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateIndemnityStatus(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateIndemnityStatus(params,function(error,result){
        if (error) {
            logger.error(' updateIndemnityStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateIndemnityStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDamageCheckIndemnity : createDamageCheckIndemnity,
    queryDamageCheckIndemnity : queryDamageCheckIndemnity,
    updateDamageCheckIndemnity : updateDamageCheckIndemnity,
    updateDamageCheckIndemnityImage : updateDamageCheckIndemnityImage,
    updateIndemnity : updateIndemnity,
    updateIndemnityStatus : updateIndemnityStatus
}