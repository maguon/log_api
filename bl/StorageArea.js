/**
 * Created by zwl on 2017/8/10.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageAreaDAO = require('../dao/StorageAreaDAO.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageArea.js');

function createStorageArea(req,res,next){
    var params = req.params ;
    var storageId = 0;
    var areaId = 0;
    Seq().seq(function(){
        var that = this;
        storageAreaDAO.addStorageArea(params,function(error,result){
            if (error) {
                logger.error(' createStorageArea ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createStorageArea ' + 'success');
                    areaId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create storageArea failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var rowArray = [] ,colArray=[];
        rowArray.length= params.row;
        colArray.length= params.col;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            Seq(colArray).seqEach(function(colObj,j){
                var that = this;
                var subParams ={
                    storageId : params.storageId,
                    areaId : areaId,
                    row : i+1,
                    col : j+1,
                }
                storageParkingDAO.addStorageParking(subParams,function(err,result){
                    if (err) {
                        logger.error(' createStorageParking ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if(result&&result.insertId>0){
                            logger.info(' createStorage parking ' + 'success');
                        }else{
                            logger.warn(' createStorage parking ' + 'failed');
                        }
                        that(null,j);
                    }
                })
            }).seq(function(){
                that(null,i);
            })
        }).seq(function(){
            that();
        })

    }).seq(function(){
        logger.info(' createStorageArea ' + 'success');
        resUtil.resetCreateRes(res,{insertId:areaId},null);
        return next();
    })

}

function queryStorageArea(req,res,next){
    var params = req.params ;
    storageAreaDAO.getStorageArea(params,function(error,result){
        if (error) {
            logger.error(' queryStorageArea ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageArea ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createStorageArea : createStorageArea,
    queryStorageArea : queryStorageArea
}