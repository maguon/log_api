/**
 * Created by zwl on 2018/4/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveSalaryDamageRelDAO = require('../dao/DriveSalaryDamageRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryDamageRel.js');

function createDriveSalaryDamageRel(req,res,next){
    var params = req.params ;
    driveSalaryDamageRelDAO.addDriveSalaryDamageRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "质损编号已经被关联，操作失败");
                return next();
            } else{
                logger.error(' createDriveSalaryDamageRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createDriveSalaryDamageRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSalaryDamageRel(req,res,next){
    var params = req.params ;
    driveSalaryDamageRelDAO.getDriveSalaryDamageRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryDamageRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryDamageRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveSalaryDamageRel(req,res,next){
    var params = req.params;
    driveSalaryDamageRelDAO.deleteDriveSalaryDamageRel(params,function(error,result){
        if (error) {
            logger.error(' removeDriveSalaryDamageRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDriveSalaryDamageRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveSalaryDamageRel : createDriveSalaryDamageRel,
    queryDriveSalaryDamageRel : queryDriveSalaryDamageRel,
    removeDriveSalaryDamageRel : removeDriveSalaryDamageRel
}