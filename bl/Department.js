/**
 * Created by zwl on 2017/3/8.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var departmentDAO = require('../dao/DepartmentDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Department.js');

function createDepartment(req,res,next){
    var params = req.params ;
    departmentDAO.addDepartment(params,function(error,result){
        if (error) {
            logger.error(' createDepartment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDepartment ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
function queryDepartment(req,res,next){
    var params = req.params ;
    departmentDAO.getDepartment(params,function(error,result){
        if (error) {
            logger.error(' queryDepartment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDepartment ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
function updateDepartment(req,res,next){
    var params = req.params ;
    departmentDAO.updateDepartment(params,function(error,result){
        if (error) {
            logger.error(' updateDepartment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDepartment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDepartment : createDepartment,
    queryDepartment : queryDepartment,
    updateDepartment : updateDepartment
}