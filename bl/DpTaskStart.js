/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpTaskStartDAO = require('../dao/DpTaskStartDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpTaskStart.js');

function createDpTaskStart(req,res,next){
    var params = req.params ;
    dpTaskStartDAO.addDpTaskStart(params,function(error,result){
        if (error) {
            logger.error(' createDpTaskStart ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpTaskStart ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskStart(req,res,next){
    var params = req.params ;
    dpTaskStartDAO.getDpTaskStart(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskStart ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskStart ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskStartBase(req,res,next){
    var params = req.params ;
    dpTaskStartDAO.getDpTaskStartBase(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskStartBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskStartBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpTaskStart : createDpTaskStart,
    queryDpTaskStart : queryDpTaskStart,
    queryDpTaskStartBase : queryDpTaskStartBase
}