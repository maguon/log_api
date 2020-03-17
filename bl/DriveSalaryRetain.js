/**
 * Created by yym on 2020/3/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var driveSalaryRetainDAO = require('../dao/DriveSalaryRetainDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSalaryTaskRel.js');

function createDriveSalaryTaskRel(req,res,next){
    var params = req.params ;
    //查询user_id
    Seq().seq(function(){
        var that = this;
        driveDAO.getDrive(params,function(error,result){
            if (error) {
                logger.error(' createDriveSalaryTaskRel getDrive ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' queryDrive ' + 'success');
                logger.info(' createDriveSalaryTaskRel getDrive ' + 'success');
                userId = result[0].user_id;
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.userId = userId;
        params.type = 1;
        driveSalaryRetainDAO.addDriveSalaryRetain(params,function(error,result){
            if (error) {
                logger.error(' createDriveSalaryTaskRel addDriveSalaryRetain ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createDriveSalaryTaskRel addDriveSalaryRetain ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDriveSalaryTaskRel(req,res,next){
    var params = req.params ;
    driveSalaryRetainDAO.getDriveSalaryRetain(params,function(error,result){
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

module.exports = {
    createDriveSalaryTaskRel : createDriveSalaryTaskRel,
    queryDriveSalaryTaskRel : queryDriveSalaryTaskRel
}
