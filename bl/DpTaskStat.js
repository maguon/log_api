/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpTaskStatDAO = require('../dao/DpTaskStatDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpTaskStat.js');

function createDpTaskStat(req,res,next){
    var params = req.params ;
    dpTaskStatDAO.addDpTaskStat(params,function(error,result){
        if (error) {
            logger.error(' createDpTaskStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpTaskStat ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskStat(req,res,next){
    var params = req.params ;
    dpTaskStatDAO.getDpTaskStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskStatBase(req,res,next){
    var params = req.params ;
    dpTaskStatDAO.getDpTaskStatBase(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskStatBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskStatBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpTaskStat : createDpTaskStat,
    queryDpTaskStat : queryDpTaskStat,
    queryDpTaskStatBase : queryDpTaskStatBase
}