/**
 * Created by zwl on 2017/6/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var baseAddrDAO = require('../dao/BaseAddrDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BaseAddr.js');

function createBaseAddr(req,res,next){
    var params = req.params ;
    baseAddrDAO.addBaseAddr(params,function(error,result){
        if (error) {
            logger.error(' createBaseAddr ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createBaseAddr ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryBaseAddr(req,res,next){
    var params = req.params ;
    baseAddrDAO.getBaseAddr(params,function(error,result){
        if (error) {
            logger.error(' queryBaseAddr ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryBaseAddr ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateBaseAddr(req,res,next){
    var params = req.params ;
    baseAddrDAO.updateBaseAddr(params,function(error,result){
        if (error) {
            logger.error(' updateBaseAddr ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateBaseAddr ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createBaseAddr : createBaseAddr,
    queryBaseAddr : queryBaseAddr,
    updateBaseAddr : updateBaseAddr
}