/**
 * Created by zwl on 2018/2/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckAccidentInsureDAO = require('../dao/TruckAccidentInsureDAO.js');
var truckAccidentInsureRelDAO = require('../dao/TruckAccidentInsureRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckAccidentInsure.js');

function createTruckAccidentInsureBase(req,res,next){
    var params = req.params ;
    var accidentInsureId = 0;
    Seq().seq(function(){
        var that = this;
        truckAccidentInsureDAO.addTruckAccidentInsure(params,function(error,result){
            if (error) {
                logger.error(' createTruckAccidentInsureBase ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createTruckAccidentInsureBase ' + 'success');
                    accidentInsureId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create truckAccidentInsureBase failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.accidentInsureId = accidentInsureId;
        truckAccidentInsureRelDAO.addTruckAccidentInsureRel(params,function(err,result){
            if (err) {
                logger.error(' createTruckAccidentInsureRel ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createTruckAccidentInsureRel ' + 'success');
                }else{
                    logger.warn(' createTruckAccidentInsureRel ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createInsure ' + 'success');
        resUtil.resetCreateRes(res,{insertId:accidentInsureId},null);
        return next();
    })
}

function createTruckAccidentInsure(req,res,next){
    var params = req.params ;
    var accidentInsureId = 0;
    Seq().seq(function(){
        var that = this;
        truckAccidentInsureDAO.addTruckAccidentInsure(params,function(error,result){
            if (error) {
                logger.error(' createTruckAccidentInsure ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createTruckAccidentInsure ' + 'success');
                    accidentInsureId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create truckAccidentInsure failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var accidentIds = params.accidentIds;
        var rowArray = [] ;
        rowArray.length= accidentIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                accidentInsureId : accidentInsureId,
                accidentId : accidentIds[i],
                row : i+1,
            }
            truckAccidentInsureRelDAO.addTruckAccidentInsureRel(subParams,function(err,result){
                if (err) {
                    logger.error(' createTruckAccidentInsureRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createTruckAccidentInsureRel ' + 'success');
                    }else{
                        logger.warn(' createTruckAccidentInsureRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createTruckAccidentInsureRel ' + 'success');
        resUtil.resetCreateRes(res,{insertId:accidentInsureId},null);
        return next();
    })
}

function queryTruckAccidentInsure(req,res,next){
    var params = req.params ;
    truckAccidentInsureDAO.getTruckAccidentInsure(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentInsure ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentInsure ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccidentInsure(req,res,next){
    var params = req.params;
    truckAccidentInsureDAO.updateTruckAccidentInsure(params,function(error,result){
        if (error) {
            logger.error(' updateTruckAccidentInsure ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckAccidentInsure ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckAccidentInsureStatus(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.completedDate = myDate;
    truckAccidentInsureDAO.updateTruckAccidentInsureStatus(params,function(error,result){
        if (error) {
            logger.error(' updateTruckAccidentInsureStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckAccidentInsureStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentInsurePlanTotal(req,res,next){
    var params = req.params ;
    truckAccidentInsureDAO.getTruckAccidentInsurePlanTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentInsurePlanTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentInsurePlanTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckAccidentInsureMonthStat(req,res,next){
    var params = req.params ;
    truckAccidentInsureDAO.getTruckAccidentInsureMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentInsureMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentInsureMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckAccidentInsureBase : createTruckAccidentInsureBase,
    createTruckAccidentInsure : createTruckAccidentInsure,
    queryTruckAccidentInsure : queryTruckAccidentInsure,
    updateTruckAccidentInsure : updateTruckAccidentInsure,
    updateTruckAccidentInsureStatus : updateTruckAccidentInsureStatus,
    queryTruckAccidentInsurePlanTotal : queryTruckAccidentInsurePlanTotal,
    queryTruckAccidentInsureMonthStat : queryTruckAccidentInsureMonthStat
}
