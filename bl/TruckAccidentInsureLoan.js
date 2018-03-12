/**
 * Created by zwl on 2018/2/23.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckAccidentInsureLoanDAO = require('../dao/TruckAccidentInsureLoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckAccidentInsureLoan.js');

function queryTruckAccidentInsureLoan(req,res,next){
    var params = req.params ;
    truckAccidentInsureLoanDAO.getTruckAccidentInsureLoan(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentInsureLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentInsureLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccidentInsureLoan(req,res,next){
    var params = req.params;
    var myDate = new Date();
    params.loanDate = myDate;
    truckAccidentInsureLoanDAO.updateTruckAccidentInsureLoan(params,function(error,result){
        if (error) {
            logger.error(' updateTruckAccidentInsureLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckAccidentInsureLoan ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccidentInsureRepayment(req,res,next){
    var params = req.params;
    var myDate = new Date();
    params.repaymentDate = myDate;
    truckAccidentInsureLoanDAO.updateTruckAccidentInsureRepayment(params,function(error,result){
        if (error) {
            logger.error(' updateTruckAccidentInsureRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckAccidentInsureRepayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccidentInsureLoanStatus(req,res,next){
    var params = req.params;
    truckAccidentInsureLoanDAO.updateTruckAccidentInsureLoanStatus(params,function(error,result){
        if (error) {
            logger.error(' updateTruckAccidentInsureLoanStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckAccidentInsureLoanStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentInsureLoanStatusCount(req,res,next){
    var params = req.params ;
    truckAccidentInsureLoanDAO.getTruckAccidentInsureLoanStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentInsureLoanStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentInsureLoanStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryTruckAccidentInsureLoan : queryTruckAccidentInsureLoan,
    updateTruckAccidentInsureLoan : updateTruckAccidentInsureLoan,
    updateTruckAccidentInsureRepayment : updateTruckAccidentInsureRepayment,
    updateTruckAccidentInsureLoanStatus : updateTruckAccidentInsureLoanStatus,
    queryTruckAccidentInsureLoanStatusCount : queryTruckAccidentInsureLoanStatusCount
}
