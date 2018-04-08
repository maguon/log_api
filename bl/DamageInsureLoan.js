/**
 * Created by zwl on 2018/3/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var damageInsureLoanDAO = require('../dao/DamageInsureLoanDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DamageInsureLoan.js');

function queryDamageInsureLoan(req,res,next){
    var params = req.params ;
    damageInsureLoanDAO.getDamageInsureLoan(params,function(error,result){
        if (error) {
            logger.error(' queryDamageInsureLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageInsureLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDamageInsureLoan(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.loanDate = myDate;
    damageInsureLoanDAO.updateDamageInsureLoan(params,function(error,result){
        if (error) {
            logger.error(' updateDamageInsureLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageInsureLoan ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDamageInsureRepayment(req,res,next){
    var params = req.params;
    var myDate = new Date();
    params.repaymentDate = myDate;
    damageInsureLoanDAO.updateDamageInsureRepayment(params,function(error,result){
        if (error) {
            logger.error(' updateDamageInsureRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageInsureRepayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDamageInsureLoanStatus(req,res,next){
    var params = req.params;
    damageInsureLoanDAO.updateDamageInsureLoanStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDamageInsureLoanStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageInsureLoanStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryDamageInsureLoanStatusCount(req,res,next){
    var params = req.params ;
    damageInsureLoanDAO.getDamageInsureLoanStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryDamageInsureLoanStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageInsureLoanStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageInsureLoanMonthStat(req,res,next){
    var params = req.params ;
    damageInsureLoanDAO.getDamageInsureLoanMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageInsureLoanMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageInsureLoanMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDamageInsureLoan : queryDamageInsureLoan,
    updateDamageInsureLoan : updateDamageInsureLoan,
    updateDamageInsureRepayment : updateDamageInsureRepayment,
    updateDamageInsureLoanStatus : updateDamageInsureLoanStatus,
    queryDamageInsureLoanStatusCount : queryDamageInsureLoanStatusCount,
    queryDamageInsureLoanMonthStat : queryDamageInsureLoanMonthStat
}
