/**
 * Created by zwl on 2017/7/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckRepairRelDAO = require('../dao/TruckRepairRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckRepairRel.js');

function createTruckRepairRel(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        truckRepairRelDAO.getTruckRepairRel({repairNum:params.repairNum},function(error,rows){
            if (error) {
                logger.error(' getTruckRepairRel ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getTruckRepairRel ' +params.repairNum+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
        var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
        var strDate = year + month + day;
        params.dateId = parseInt(strDate);
        params.repairDate = myDate;
        truckRepairRelDAO.addTruckRepairRel(params,function(error,result){
            if (error) {
                logger.error(' createTruckRepairRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createTruckRepairRel ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryTruckRepairRel(req,res,next){
    var params = req.params ;
    truckRepairRelDAO.getTruckRepairRel(params,function(error,result){
        if (error) {
            logger.error(' queryTruckRepairRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckRepairRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckRepairRelCount(req,res,next){
    var params = req.params ;
    truckRepairRelDAO.getTruckRepairRelCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckRepairRelCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckRepairRelCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckRepairRel(req,res,next){
    var params = req.params ;
    truckRepairRelDAO.updateTruckRepairRel(params,function(error,result){
        if (error) {
            logger.error(' updateTruckRepairRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckRepairRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckRepairRel : createTruckRepairRel,
    queryTruckRepairRel : queryTruckRepairRel,
    queryTruckRepairRelCount : queryTruckRepairRelCount,
    updateTruckRepairRel : updateTruckRepairRel
}