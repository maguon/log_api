/**
 * Created by zwl on 2018/2/27.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteTaskLoanDAO = require('../dao/DpRouteTaskLoanDAO.js');
var dpRouteTaskLoanRelDAO = require('../dao/DpRouteTaskLoanRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteTaskLoan.js');

function createDpRouteTaskLoan(req,res,next){
    var params = req.params ;
    var dpRouteTaskLoanId = 0;
    Seq().seq(function(){
        var that = this;
        var myDate = new Date();
        params.applyDate = myDate;
        dpRouteTaskLoanDAO.addDpRouteTaskLoan(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteTaskLoan ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTaskLoan ' + 'success');
                    dpRouteTaskLoanId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create dpRouteTaskLoan failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var dpRouteTaskIds = params.dpRouteTaskIds;
        var rowArray = [] ;
        rowArray.length= dpRouteTaskIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                dpRouteTaskLoanId : dpRouteTaskLoanId,
                dpRouteTaskId : dpRouteTaskIds[i],
                row : i+1,
            }
            dpRouteTaskLoanRelDAO.addDpRouteTaskLoanRel(subParams,function(err,result){
                if (err) {
                    logger.error(' createTruckAccidentInsureRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createTruckAccidentInsureRel ' + 'success');
                    }else{
                        logger.warn(' createTruckAccidentInsureRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createDpRouteTaskLoan ' + 'success');
        resUtil.resetCreateRes(res,{insertId:dpRouteTaskLoanId},null);
        return next();
    })
}

function queryDpRouteTaskLoan(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanDAO.getDpRouteTaskLoan(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskLoanGrant (req,res,next){
    var params = req.params;
    var myDate = new Date();
    params.grantDate = myDate;
    dpRouteTaskLoanDAO.updateDpRouteTaskLoanGrant(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskLoanGrant ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskLoanGrant ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskLoanRepayment (req,res,next){
    var params = req.params;
    var myDate = new Date();
    params.refundDate = myDate;
    dpRouteTaskLoanDAO.updateDpRouteTaskLoanRepayment(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskLoanRepayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskLoanStatus (req,res,next){
    var params = req.params;
    dpRouteTaskLoanDAO.updateDpRouteTaskLoanStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskLoanStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskLoanStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteTaskLoan : createDpRouteTaskLoan,
    queryDpRouteTaskLoan : queryDpRouteTaskLoan,
    updateDpRouteTaskLoanGrant : updateDpRouteTaskLoanGrant,
    updateDpRouteTaskLoanRepayment : updateDpRouteTaskLoanRepayment,
    updateDpRouteTaskLoanStatus : updateDpRouteTaskLoanStatus
}