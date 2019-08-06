/**
 * Created by zwl on 2017/6/1.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleOuterInvoiceDAO = require('../dao/SettleOuterInvoiceDAO.js');
var settleOuterInvoiceCarRelDAO = require('../dao/SettleOuterInvoiceCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterInvoice.js');

function createSettleOuterInvoiceBatch(req,res,next){
    var params = req.params ;
    var outerInvoiceId = 0;
    Seq().seq(function(){
        var that = this;
        settleOuterInvoiceDAO.addSettleOuterInvoiceBatch(params,function(error,result){
            if (error) {
                logger.error(' createSettleOuterInvoiceBatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    outerInvoiceId = result.insertId;
                    logger.info(' createSettleOuterInvoiceBatch ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res," 数据已存在，请重新筛选 ");
                    return next();
                }

            }
        })
    }).seq(function(){
        params.outerInvoiceId = outerInvoiceId;
        settleOuterInvoiceCarRelDAO.addSettleOuterInvoiceCarRelBatch(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "此数据已存在，操作失败");
                    return next();
                } else{
                    logger.error(' createSettleOuterInvoiceBatch ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                logger.info(' createSettleOuterInvoiceBatch ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function querySettleOuterInvoice(req,res,next){
    var params = req.params ;
    settleOuterInvoiceDAO.getSettleOuterInvoice(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterInvoice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterInvoice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createSettleOuterInvoiceBatch : createSettleOuterInvoiceBatch,
    querySettleOuterInvoice : querySettleOuterInvoice
}