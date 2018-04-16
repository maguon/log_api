/**
 * Created by zwl on 2018/4/16.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveSalaryDAO = require('../dao/DriveSalaryDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DriveSalary.js');

function queryDriveSalary(req,res,next){
    var params = req.params;
    var strDate = moment(params.monthDateId).format('YYYYMM');
    params.monthDateId = parseInt(strDate);
    driveSalaryDAO.getDriveSalary(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalary ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDriveSalary : queryDriveSalary
}
