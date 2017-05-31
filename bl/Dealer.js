/**
 * Created by zwl on 2017/4/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dealerDAO = require('../dao/DealerDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Dealer.js');

function createDealer(req,res,next){
    var params = req.params ;
    dealerDAO.addDealer(params,function(error,result){
        if (error) {
            logger.error(' createDealer ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDealer ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDealer(req,res,next){
    var params = req.params ;
    dealerDAO.getDealer(params,function(error,result){
        if (error) {
            logger.error(' queryDealer ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDealer ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDealer : createDealer,
    queryDealer : queryDealer
}