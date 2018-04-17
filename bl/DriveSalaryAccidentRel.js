/**
 * Created by zwl on 2018/4/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveSalaryAccidentRelDAO = require('../dao/DriveSalaryAccidentRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryAccidentRel.js');

function createDriveSalaryAccidentRel(req,res,next){
    var params = req.params ;
    driveSalaryAccidentRelDAO.addDriveSalaryAccidentRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "事故编号已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createDriveSalaryAccidentRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createDriveSalaryAccidentRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSalaryAccidentRel(req,res,next){
    var params = req.params ;
    driveSalaryAccidentRelDAO.getDriveSalaryAccidentRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryAccidentRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryAccidentRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveSalaryAccidentRel(req,res,next){
    var params = req.params;
    driveSalaryAccidentRelDAO.deleteDriveSalaryAccidentRel(params,function(error,result){
        if (error) {
            logger.error(' removeDriveSalaryAccidentRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDriveSalaryAccidentRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveSalaryAccidentRel : createDriveSalaryAccidentRel,
    queryDriveSalaryAccidentRel : queryDriveSalaryAccidentRel,
    removeDriveSalaryAccidentRel : removeDriveSalaryAccidentRel
}