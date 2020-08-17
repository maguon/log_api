/**
 * Created by yym on 2020/8/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var damageQaTaskDAO = require('../dao/DamageQaTaskDAO.js');
var damageQaTaskCarRelDAO = require('../dao/DamageQaTaskCarRelDAO.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DamageQaTask.js');

function createDamageQaTask(req,res,next) {
    var params = req.params;
    var qtId = 0;
    var myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');

    Seq().seq(function () {
        var that = this;
        damageQaTaskDAO.getQaUploadId(params, function (error, rows) {
            if (error) {
                logger.error(' createDamageQaTask getQaUploadId ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows&&rows.length>0){
                    resUtil.resetFailedRes(res,"该批车辆已被导入，请不要重复导入");
                    return next();
                }else{
                    logger.info(' createDamageQaTask getQaUploadId ' + 'success');
                    that();
                }
            }
        })
    }).seq(function () {
        var that = this;
        damageQaTaskDAO.addDamageQaTask(params, function (error, result) {
            if (error) {
                logger.error(' createDamageQaTask addDamageQaTask ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDamageQaTask addDamageQaTask ' + 'success');
                    qtId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"createDamageQaTask addDamageQaTask failed");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.qtId = qtId;
        params.qaStatus = 0;
        damageQaTaskCarRelDAO.addDamageQaTaskCarRel(params,function(error,result){
            if (error) {
                logger.error(' createDamageQaTaskCar addDamageQaTaskCarRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createDamageQaTaskCar addDamageQaTaskCarRel ' + 'success');
                var returnMsg = {
                    "insertId": qtId
                }
                resUtil.resetCreateRes(res,returnMsg,null);
                return next();
            }
        })
    })
}

function queryDamageQaTask(req,res,next){
    var params = req.params;
    damageQaTaskDAO.getDamageQaTask(params,function(error,result){
        if (error) {
            logger.error(' queryDamageQaTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageQaTask ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    createDamageQaTask : createDamageQaTask,
    queryDamageQaTask : queryDamageQaTask
}
