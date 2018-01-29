/**
 * Created by zwl on 2018/1/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteLoadTaskCleanRelDAO = require('../dao/DpRouteLoadTaskCleanRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskCleanRel.js');

function queryDpRouteLoadTaskCleanRel(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRel(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRelMonthStat(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRelMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRelMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRelMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRelReceiveMonthStat(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRelReceiveMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRelReceiveMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRelReceiveMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRelWeekStat(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRelWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRelWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRelWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteLoadTaskCleanRelReceiveWeekStat(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRelReceiveWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRelReceiveWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRelReceiveWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteLoadTaskCleanRelStatus(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.cleanDate = myDate;
    dpRouteLoadTaskCleanRelDAO.updateDpRouteLoadTaskCleanRelStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteLoadTaskCleanRelStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteLoadTaskCleanRelStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDpRouteLoadTaskCleanRel : queryDpRouteLoadTaskCleanRel,
    queryDpRouteLoadTaskCleanRelMonthStat : queryDpRouteLoadTaskCleanRelMonthStat,
    queryDpRouteLoadTaskCleanRelReceiveMonthStat : queryDpRouteLoadTaskCleanRelReceiveMonthStat,
    queryDpRouteLoadTaskCleanRelWeekStat : queryDpRouteLoadTaskCleanRelWeekStat,
    queryDpRouteLoadTaskCleanRelReceiveWeekStat : queryDpRouteLoadTaskCleanRelReceiveWeekStat,
    updateDpRouteLoadTaskCleanRelStatus : updateDpRouteLoadTaskCleanRelStatus
}
