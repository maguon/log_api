/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpTaskStatDAO = require('../dao/DpTaskStatDAO.js');
var dpDemandDAO = require('../dao/DpDemandDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpTaskStat.js');

function createDpTaskStat(req,res,next){
    var params = req.params ;
    dpTaskStatDAO.addDpTaskStat(params,function(error,result){
        if (error) {
            logger.error(' createDpTaskStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpTaskStat ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskStat(req,res,next){
    var params = req.params ;
    dpTaskStatDAO.getDpTaskStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskStatBase(req,res,next){
    var params = req.params ;
    dpTaskStatDAO.getDpTaskStatBase(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskStatBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskStatBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpTaskStatCount(req,res,next){
    var params = req.params ;
    dpTaskStatDAO.getDpTaskStatCount(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskStatCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskStatCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpTaskStatStatus(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        if(params.dateId !=null || params.dateId !=""){
            var dateId = params.dateId;
            var d = new Date(dateId);
            var currentDateStr = moment(d).format('YYYYMMDD');
            params.dateId = parseInt(currentDateStr);
        }
        params.demandStatus = sysConst.DEMAND_STATUS.not_completed;
        dpDemandDAO.getDpDemandBase(params,function(error,rows){
            if (error) {
                logger.error(' getDpDemandBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    logger.warn(' getDpDemandBase ' + 'failed');
                    resUtil.resetFailedRes(res," 需求未全部完成，不能关闭 ");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function () {
        dpTaskStatDAO.updateDpTaskStatStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDpTaskStatStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpTaskStatStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createDpTaskStat : createDpTaskStat,
    queryDpTaskStat : queryDpTaskStat,
    queryDpTaskStatBase : queryDpTaskStatBase,
    queryDpTaskStatCount : queryDpTaskStatCount,
    updateDpTaskStatStatus : updateDpTaskStatStatus
}