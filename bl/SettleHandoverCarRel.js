/**
 * Created by zwl on 2018/6/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleHandoverCarRelDAO = require('../dao/SettleHandoverCarRelDAO.js');
var settleHandoverDAO = require('../dao/SettleHandoverDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverCarRel.js');

function createSettleHandoverCarRel(req,res,next){
    var params = req.params ;
    var settleHandoverId = 0;
    Seq().seq(function(){
        var that = this;
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
                if(result&&result.insertId>0){
                    settleHandoverId = result.insertId;
                    logger.info(' createSettleHandoverCarRel ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create settleHandoverCarRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        settleHandoverDAO.updateCarCountPlus(params,function(error,result){
            if (error) {
                logger.error(' updateCarCountPlus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCarCountPlus ' + 'success');
                }else{
                    logger.warn(' updateCarCountPlus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createSettleHandoverCarRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:settleHandoverId},null);
        return next();
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
    Seq().seq(function(){
        var that = this;
        settleHandoverCarRelDAO.deleteSettleHandoverCarRel(params,function(error,result){
            if (error) {
                logger.error(' removeSettleHandoverCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeSettleHandoverCarRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeSettleHandoverCarRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        settleHandoverDAO.updateCarCountMinus(params,function(error,result){
            if (error) {
                logger.error(' updateCarCountMinus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarCountMinus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createSettleHandoverCarRel : createSettleHandoverCarRel,
    querySettleHandoverCarRel : querySettleHandoverCarRel,
    removeSettleHandoverCarRel : removeSettleHandoverCarRel
}

