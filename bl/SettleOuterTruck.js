/**
 * Created by zwl on 2019/7/8.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleOuterTruckDAO = require('../dao/SettleOuterTruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterTruck.js');

function createSettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.addSettleOuterTruck(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "此数据已存在，操作失败");
                return next();
            } else{
                logger.error(' createSettleOuterTruck ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createSettleOuterTruck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function querySettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.getSettleOuterTruck(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterTruck ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function querySettleOuterTruckList(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.getSettleOuterTruckList(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterTruckList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterTruckList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateSettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.updateSettleOuterTruck(params,function(error,result){
        if (error) {
            logger.error(' updateSettleOuterTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateSettleOuterTruck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}



module.exports = {
    createSettleOuterTruck : createSettleOuterTruck,
    querySettleOuterTruck : querySettleOuterTruck,
    querySettleOuterTruckList : querySettleOuterTruckList,
    updateSettleOuterTruck : updateSettleOuterTruck
}
