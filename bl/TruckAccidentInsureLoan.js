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


module.exports = {
    queryTruckAccidentInsureLoan : queryTruckAccidentInsureLoan,
    updateTruckAccidentInsureLoanStatus : updateTruckAccidentInsureLoanStatus
}
