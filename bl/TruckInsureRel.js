/**
 * Created by zwl on 2017/7/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckInsureRelDAO = require('../dao/TruckInsureRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckInsureRel.js');

function createTruckInsureRel(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        truckInsureRelDAO.getTruckInsureRel({insureNum:params.insureNum},function(error,rows){
            if (error) {
                logger.error(' getTruckInsureRel ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getTruckInsureRel ' +params.insureNum+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,"保单编号已经存在");
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.insureDate = myDate;
        truckInsureRelDAO.addTruckInsureRel(params,function(error,result){
            if (error) {
                logger.error(' createTruckInsureRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createTruckInsureRel ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryTruckInsureRel(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.getTruckInsureRel(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsureRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckInsureTypeTotal(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.getTruckInsureTypeTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsureTypeTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsureTypeTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckInsureMoneyTotal(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.getTruckInsureMoneyTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsureMoneyTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsureMoneyTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckInsureCountTotal(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.getTruckInsureCountTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckInsureCountTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckInsureCountTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckInsureRel(req,res,next){
    var params = req.params ;
    truckInsureRelDAO.updateTruckInsureRel(params,function(error,result){
        if (error) {
            logger.error(' updateTruckInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckInsureRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckInsureRel : createTruckInsureRel,
    queryTruckInsureRel : queryTruckInsureRel,
    queryTruckInsureTypeTotal : queryTruckInsureTypeTotal,
    queryTruckInsureMoneyTotal : queryTruckInsureMoneyTotal,
    queryTruckInsureCountTotal : queryTruckInsureCountTotal,
    updateTruckInsureRel : updateTruckInsureRel
}