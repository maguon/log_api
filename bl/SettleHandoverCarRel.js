/**
 * Created by zwl on 2018/6/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleHandoverCarRelDAO = require('../dao/SettleHandoverCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverCarRel.js');

function createSettleHandoverCarRel(req,res,next){
    var params = req.params ;
    settleHandoverCarRelDAO.addSettleHandoverCarRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "VIN已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createSettleHandoverCarRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createSettleHandoverCarRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function querySettleHandoverCarRel(req,res,next){
    var params = req.params ;
    settleHandoverCarRelDAO.getSettleHandoverCarRel(params,function(error,result){
        if (error) {
            logger.error(' querySettleHandoverCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleHandoverCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeSettleHandoverCarRel(req,res,next){
    var params = req.params;
    settleHandoverCarRelDAO.deleteSettleHandoverCarRel(params,function(error,result){
        if (error) {
            logger.error(' removeSettleHandoverCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeSettleHandoverCarRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createSettleHandoverCarRel : createSettleHandoverCarRel,
    querySettleHandoverCarRel : querySettleHandoverCarRel,
    removeSettleHandoverCarRel : removeSettleHandoverCarRel
}

