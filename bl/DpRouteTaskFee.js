/**
 * Created by zwl on 2019/5/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteTaskFeeDAO = require('../dao/DpRouteTaskFeeDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskFee.js');

function createDpRouteTaskFee(req,res,next){
    var params = req.params ;
    dpRouteTaskFeeDAO.addDpRouteTaskFee(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteTaskFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteTaskFee ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskFee(req,res,next){
    var params = req.params ;
    dpRouteTaskFeeDAO.getDpRouteTaskFee(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskFee ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteTaskFee : createDpRouteTaskFee,
    queryDpRouteTaskFee : queryDpRouteTaskFee
}