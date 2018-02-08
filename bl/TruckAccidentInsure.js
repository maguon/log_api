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


module.exports = {
    createTruckAccidentInsure : createTruckAccidentInsure,
    queryTruckAccidentInsure : queryTruckAccidentInsure
}
