/**
 * Created by zwl on 2018/3/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteTaskLoanRelDAO = require('../dao/DpRouteTaskLoanRelDAO.js');
var dpRouteTaskLoanDAO = require('../dao/DpRouteTaskLoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskLoanRel.js');

function createDpRouteTaskLoanRel(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanRelDAO.addDpRouteTaskLoanRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "调度编号已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createDpRouteTaskLoanRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createDpRouteTaskLoanRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskLoanRel(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanRelDAO.getDpRouteTaskLoanRel(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskLoanRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskLoanRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDpRouteTaskLoanRel(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteTaskLoanDAO.getDpRouteTaskLoan(params,function(error,rows){
            if (error) {
                logger.error(' getDpRouteTaskLoan ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0&&rows[0].task_loan_status == sysConst.TASK_LOAN_STATUS.refund){
                    logger.warn(' getDpRouteTaskLoan ' + 'failed');
                    resUtil.resetFailedRes(res," 出车款已报销，不能删除调度关联 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        dpRouteTaskLoanRelDAO.deleteDpRouteTaskLoanRel(params,function(error,result){
             if (error) {
                 logger.error(' removeDpRouteTaskLoanRel ' + error.message);
                 throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
             } else {
                 logger.info(' removeDpRouteTaskLoanRel ' + 'success');
                 resUtil.resetUpdateRes(res,result,null);
                 return next();
             }
        })
    })
}

function removeDpRouteTaskLoanRelAll(req,res,next){
    var params = req.params;
    dpRouteTaskLoanRelDAO.deleteDpRouteTaskLoanRelAll(params,function(error,result){
        if (error) {
            logger.error(' removeDpRouteTaskLoanRelAll ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDpRouteTaskLoanRelAll ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteTaskLoanRel : createDpRouteTaskLoanRel,
    queryDpRouteTaskLoanRel : queryDpRouteTaskLoanRel,
    removeDpRouteTaskLoanRel : removeDpRouteTaskLoanRel,
    removeDpRouteTaskLoanRelAll : removeDpRouteTaskLoanRelAll
}
