/**
 * Created by zwl on 2018/11/19.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var dpRouteTaskTmpDAO = require('../dao/DpRouteTaskTmpDAO.js');
var dpRouteLoadTaskTmpDAO = require('../dao/DpRouteLoadTaskTmpDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskTmp.js');

function createDpRouteTaskTmp(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function() {
        var that = this;
        truckDAO.getTruckBase({truckId:params.truckId}, function (error, rows) {
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows&&rows.length>0) {
                    parkObj.operateType=rows[0].operate_type;
                    that();
                } else {
                    that();
                }
            }
        })
    }).seq(function(){
        if(params.reverseFlag == null || params.reverseFlag == ""){
            params.reverseFlag = 0;
            params.reverseMoney = 0;
        }
        if(parkObj.operateType==1){
            params.outerFlag = 0;
        }else{
            params.outerFlag = 1;
        }
        dpRouteTaskTmpDAO.addDpRouteTaskTmp(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteTaskTmp ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createDpRouteTaskTmp ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDpRouteTaskTmp(req,res,next){
    var params = req.params ;
    dpRouteTaskTmpDAO.getDpRouteTaskTmp(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskTmp ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskTmp ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDpRouteTaskTmp(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteLoadTaskTmpDAO.getDpRouteLoadTaskTmp(params,function(error,rows){
            if (error) {
                logger.error(' getDpRouteLoadTaskTmp ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0){
                    logger.warn(' getDpRouteLoadTaskTmp ' + 'failed');
                    resUtil.resetFailedRes(res," 请先删除该段路线任务，在删除路线。 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        dpRouteTaskTmpDAO.deleteDpRouteTaskTmp(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTaskTmp ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' removeDpRouteTaskTmp ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDpRouteTaskTmp : createDpRouteTaskTmp,
    queryDpRouteTaskTmp : queryDpRouteTaskTmp,
    removeDpRouteTaskTmp : removeDpRouteTaskTmp
}