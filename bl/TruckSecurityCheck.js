/**
 * Created by zwl on 2019/1/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckSecurityCheckDAO = require('../dao/TruckSecurityCheckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckSecurityCheck.js');

function createTruckSecurityCheck(req,res,next){
    var params = req.params ;
    truckSecurityCheckDAO.addTruckSecurityCheck(params,function(error,result){
        if (error) {
            logger.error(' createTruckSecurityCheck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruckSecurityCheck ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryTruckSecurityCheck(req,res,next){
    var params = req.params ;
    truckSecurityCheckDAO.getTruckSecurityCheck(params,function(error,result){
        if (error) {
            logger.error(' queryTruckSecurityCheck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckSecurityCheck ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckSecurityCheck : createTruckSecurityCheck,
    queryTruckSecurityCheck : queryTruckSecurityCheck
}