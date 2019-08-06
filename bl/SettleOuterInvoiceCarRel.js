/**
 * Created by zwl on 2019/8/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var settleOuterInvoiceCarRelDAO = require('../dao/SettleOuterInvoiceCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterInvoiceCarRel.js');

function querySettleOuterInvoiceCarRel(req,res,next){
    var params = req.params ;
    settleOuterInvoiceCarRelDAO.getSettleOuterInvoiceCarRel(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterInvoiceCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterInvoiceCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    querySettleOuterInvoiceCarRel : querySettleOuterInvoiceCarRel
}
