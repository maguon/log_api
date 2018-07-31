/**
 * Created by zwl on 2018/7/26.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpTransferDemandDAO = require('../dao/DpTransferDemandDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpTransferDemand.js');

function queryDpTransferDemand(req,res,next){
    var params = req.params ;
    dpTransferDemandDAO.getDpTransferDemand(params,function(error,result){
        if (error) {
            logger.error(' queryDpTransferDemand ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTransferDemand ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpTransferDemandStat(req,res,next){
    var params = req.params ;
    dpTransferDemandDAO.getDpTransferDemandStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpTransferDemandStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTransferDemandStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDpTransferDemand : queryDpTransferDemand,
    queryDpTransferDemandStat : queryDpTransferDemandStat
}
