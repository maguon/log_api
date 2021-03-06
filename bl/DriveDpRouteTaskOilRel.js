/**
 * Created by zwl on 2018/3/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var driveDpRouteTaskOilRelDAO = require('../dao/DriveDpRouteTaskOilRelDAO.js');
var dpRouteTaskOilRelDAO = require('../dao/DpRouteTaskOilRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveDpRouteTaskOilRel.js');

function createDriveDpRouteTaskOilRel(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        driveDpRouteTaskOilRelDAO.addDriveDpRouteTaskOilRel(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "重复关联，操作失败");
                    return next();
                } else{
                    logger.error(' createDriveDpRouteTaskOilRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDriveDpRouteTaskOilRel ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createDriveDpRouteTaskOilRel failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.settleStatus = sysConst.SETTLE_STATUS.settle;
        dpRouteTaskOilRelDAO.updateDpRouteTaskOilRelStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteTaskOilRelStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpRouteTaskOilRelStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDriveDpRouteTaskOilRel(req,res,next){
    var params = req.params ;
    driveDpRouteTaskOilRelDAO.getDriveDpRouteTaskOilRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveDpRouteTaskOilRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveDpRouteTaskOilRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveDpRouteTaskOilRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        driveDpRouteTaskOilRelDAO.deleteDriveDpRouteTaskOilRel(params,function(error,result){
            if (error) {
                logger.error(' removeDriveDpRouteTaskOilRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDriveDpRouteTaskOilRel ' + 'success');
                    that();
                }else{
                    logger.warn(' removeDriveDpRouteTaskOilRel ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.settleStatus = sysConst.SETTLE_STATUS.not_settle;
        dpRouteTaskOilRelDAO.updateDpRouteTaskOilRelStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteTaskOilRelStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpRouteTaskOilRelStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDriveDpRouteTaskOilRel : createDriveDpRouteTaskOilRel,
    queryDriveDpRouteTaskOilRel : queryDriveDpRouteTaskOilRel,
    removeDriveDpRouteTaskOilRel : removeDriveDpRouteTaskOilRel
}
