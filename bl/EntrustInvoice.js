/**
 * Created by zwl on 2019/7/26.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var entrustInvoiceDAO = require('../dao/EntrustInvoiceDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustInvoice.js');

function queryEntrustInvoice(req,res,next){
    var params = req.params ;
    entrustInvoiceDAO.getEntrustInvoice(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustInvoice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustInvoice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateEntrustInvoice(req,res,next){
    var params = req.params ;
    entrustInvoiceDAO.updateEntrustInvoice(params,function(error,result){
        if (error) {
            logger.error(' updateEntrustInvoice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateEntrustInvoice ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateEntrustInvoiceStatus(req,res,next){
    var params = req.params ;
    entrustInvoiceDAO.updateEntrustInvoiceStatus(params,function(error,result){
        if (error) {
            logger.error(' updateEntrustInvoiceStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateEntrustInvoiceStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryEntrustInvoice : queryEntrustInvoice,
    updateEntrustInvoice : updateEntrustInvoice,
    updateEntrustInvoiceStatus : updateEntrustInvoiceStatus
}
