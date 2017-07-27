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
    updateTruckInsureRel : updateTruckInsureRel
}