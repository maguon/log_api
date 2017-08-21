/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRootTaskDAO = require('../dao/DpRootTaskDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRootTask.js');

function createDpRootTask(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.taskStartDate = myDate;
    dpRootTaskDAO.addDpRootTask(params,function(error,result){
        if (error) {
            logger.error(' createDpRootTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRootTask ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRootTask(req,res,next){
    var params = req.params ;
    dpRootTaskDAO.getDpRootTask(params,function(error,result){
        if (error) {
            logger.error(' queryDpRootTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRootTask ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRootTask : createDpRootTask,
    queryDpRootTask : queryDpRootTask
}