/**
 * Created by yym on 2020/8/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var damageQaTaskCarRelDAO = require('../dao/DamageQaTaskCarRelDAO.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DamageQaTaskCarRel.js');

function queryDamageQaTaskCarRel(req,res,next){
    var params = req.params;
    damageQaTaskCarRelDAO.getDamageQaTaskCarRel(params,function(error,result){
        if (error) {
            logger.error(' queryDamageQaTaskCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageQaTaskCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function damageQaTaskDayStat(req,res,next){
    var params = req.params;
    damageQaTaskCarRelDAO.damageQaTaskCarRelByDayStat(params,function(error,result){
        if (error) {
            logger.error(' damageQaTaskDayStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' damageQaTaskDayStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function damageQaTaskUserStat(req,res,next){
    var params = req.params;
    damageQaTaskCarRelDAO.damageQaTaskUserStat(params,function(error,result){
        if (error) {
            logger.error(' damageQaTaskUserStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' damageQaTaskUserStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    queryDamageQaTaskCarRel : queryDamageQaTaskCarRel,
    damageQaTaskDayStat : damageQaTaskDayStat,
    damageQaTaskUserStat : damageQaTaskUserStat
}
