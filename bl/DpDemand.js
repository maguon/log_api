/**
 * Created by zwl on 2017/8/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpDemandDAO = require('../dao/DpDemandDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpDemand.js');

function createDpDemand(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.demandDate = myDate;
    dpDemandDAO.addDpDemand(params,function(error,result){
        if (error) {
            logger.error(' createDpDemand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpDemand ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpDemand(req,res,next){
    var params = req.params ;
    dpDemandDAO.getDpDemand(params,function(error,result){
        if (error) {
            logger.error(' queryDpDemand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpDemand ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpDemand : createDpDemand,
    queryDpDemand : queryDpDemand
}