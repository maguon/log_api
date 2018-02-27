/**
 * Created by zwl on 2018/2/27.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteTaskLoanDAO = require('../dao/DpRouteTaskLoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskLoan.js');

function queryDpRouteTaskLoan(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanDAO.getDpRouteTaskLoan(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDpRouteTaskLoan : queryDpRouteTaskLoan
}