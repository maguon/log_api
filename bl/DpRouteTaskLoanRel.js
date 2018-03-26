/**
 * Created by zwl on 2018/3/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteTaskLoanRelDAO = require('../dao/DpRouteTaskLoanRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskLoanRel.js');

function createDpRouteTaskLoanRel(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanRelDAO.addDpRouteTaskLoanRel(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteTaskLoanRel( ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteTaskLoanRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskLoanRel(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanRelDAO.getDpRouteTaskLoanRel(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskLoanRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskLoanRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDpRouteTaskLoanRel(req,res,next){
    var params = req.params;
    dpRouteTaskLoanRelDAO.deleteDpRouteTaskLoanRel(params,function(error,result){
        if (error) {
            logger.error(' removeDpRouteTaskLoanRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDpRouteTaskLoanRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteTaskLoanRel : createDpRouteTaskLoanRel,
    queryDpRouteTaskLoanRel : queryDpRouteTaskLoanRel,
    removeDpRouteTaskLoanRel : removeDpRouteTaskLoanRel
}
