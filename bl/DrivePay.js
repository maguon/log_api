/**
 * Created by zwl on 2018/4/16.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var drivePayDAO = require('../dao/DrivePayDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DrivePay.js');

function queryDrivePay(req,res,next){
    var params = req.params;
    var strDate = moment(params.monthDateId).format('YYYYMM');
    params.monthDateId = parseInt(strDate);
    drivePayDAO.getDrivePay(params,function(error,result){
        if (error) {
            logger.error(' queryDrivePay ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrivePay ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDrivePay : queryDrivePay
}
