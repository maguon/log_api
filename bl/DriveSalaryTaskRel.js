/**
 * Created by zwl on 2018/4/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveSalaryTaskRelDAO = require('../dao/DriveSalaryTaskRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryTaskRel.js');

function queryDriveSalaryTaskRel(req,res,next){
    var params = req.params ;
    driveSalaryTaskRelDAO.getDriveSalaryTaskRel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryTaskRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryTaskRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeDriveSalaryTaskRel(req,res,next){
    var params = req.params;
    driveSalaryTaskRelDAO.deleteDriveSalaryTaskRel(params,function(error,result){
        if (error) {
            logger.error(' removeDriveSalaryTaskRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDriveSalaryTaskRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDriveSalaryTaskRel : queryDriveSalaryTaskRel,
    removeDriveSalaryTaskRel : removeDriveSalaryTaskRel
}
