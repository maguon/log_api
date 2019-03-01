/**
 * Created by zwl on 2017/5/31.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var receiveDAO = require('../dao/ReceiveDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Receive.js');

function createReceive(req,res,next){
    var params = req.params ;
    if(params.makeId==null || params.makeId==""){
        params.makeId = 0;
    }
    if(params.cityId==null || params.cityId==""){
        params.cityId = 0;
    }
    receiveDAO.addReceive(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "经销商已经存在，请重新录入");
                return next();
            } else{
                logger.error(' createReceive ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createReceive ' + 'success');
            req.params.receiverContent =" 经销商信息录入 ";
            req.params.receiveId = result.insertId;
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryReceive(req,res,next){
    var params = req.params ;
    receiveDAO.getReceive(params,function(error,result){
        if (error) {
            logger.error(' queryReceive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryReceive ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryReceiveCount(req,res,next){
    var params = req.params ;
    receiveDAO.getReceiveCount(params,function(error,result){
        if (error) {
            logger.error(' queryReceiveCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryReceiveCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateReceive(req,res,next){
    var params = req.params ;
    if(params.makeId==null || params.makeId==""){
        params.makeId = 0;
    }
    if(params.cityId==null || params.cityId==""){
        params.cityId = 0;
    }
    receiveDAO.updateReceive(params,function(error,result){
        if (error) {
            logger.error(' updateReceive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateReceive ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
function updateReceiveCleanFee(req,res,next){
    var params = req.params ;
    receiveDAO.updateReceiveCleanFee(params,function(error,result){
        if (error) {
            logger.error(' updateReceiveCleanFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            req.params.receiverContent ="调整洗车费单价("+params.cleanFee+")     调整门卫费单价("+params.guardFee+")";
            logger.info(' updateReceiveCleanFee ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createReceive : createReceive,
    queryReceive : queryReceive,
    queryReceiveCount : queryReceiveCount,
    updateReceive : updateReceive ,
    updateReceiveCleanFee : updateReceiveCleanFee
}