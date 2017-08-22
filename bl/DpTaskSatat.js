/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpTaskSatatDAO = require('../dao/DpTaskSatatDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpTaskSatat.js');

function createDpTaskSatat(req,res,next){
    var params = req.params ;
    dpTaskSatatDAO.addDpTaskSatat(params,function(error,result){
        if (error) {
            logger.error(' createDpTaskSatat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpTaskSatat ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskSatat(req,res,next){
    var params = req.params ;
    dpTaskSatatDAO.getDpTaskSatat(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskSatat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskSatat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskSatatBase(req,res,next){
    var params = req.params ;
    dpTaskSatatDAO.getDpTaskSatatBase(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskSatatBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskSatatBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpTaskSatat : createDpTaskSatat,
    queryDpTaskSatat : queryDpTaskSatat,
    queryDpTaskSatatBase : queryDpTaskSatatBase
}