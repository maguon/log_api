/**
 * Created by zwl on 2017/4/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageDAO = require('../dao/StorageDAO.js');
var storageParkingDAO = require('../dao/StorageParkingDAO.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Storage.js');

function createStorage(req,res,next){
    var params = req.params ;
    storageDAO.addStorage(params,function(error,result){
        if (error) {
            logger.error(' createStorage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createStorage ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryStorage(req,res,next){
    var params = req.params ;
    storageDAO.getStorage(params,function(error,result){
        if (error) {
            logger.error(' queryStorage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageDate(req,res,next){
    var params = req.params ;
    storageDAO.getStorageDate(params,function(error,result){
        if (error) {
            logger.error(' queryStorageDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageParkingCount(req,res,next){
    var params = req.params ;
    storageDAO.getStorageParkingCount(params,function(error,result){
        if (error) {
            logger.error(' queryStorageParkingCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageParkingCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageCount(req,res,next){
    var params = req.params ;
    storageDAO.getStorageCount(params,function(error,result){
        if (error) {
            logger.error(' queryStorageCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageTotalMonth(req,res,next){
    var params = req.params ;
    storageDAO.getStorageTotalMonth(params,function(error,result){
        if (error) {
            logger.error(' queryStorageTotalMonth ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageTotalMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryStorageTotalDay(req,res,next){
    var params = req.params ;
    storageDAO.getStorageTotalDay(params,function(error,result){
        if (error) {
            logger.error(' queryStorageTotalDay ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageTotalDay ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateStorage(req,res,next){
    var params = req.params ;
    storageDAO.updateStorage(params,function(error,result){
        if (error) {
            logger.error(' updateStorage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateStorage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateStorageStatus (req,res,next){
    var params = req.params;
     var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
    var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
    var dateStr = year + month + day;
    Seq().seq(function(){
        var that = this;
        var subParams ={
            storageId : params.storageId,
            dateStart : dateStr,
            dateEnd : dateStr
        }
        storageDAO.getStorageDate(subParams,function(error,rows){
            if (error) {
                logger.error(' getStorageDate ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0 &&rows[0].balance == 0){
                    that();
                }else{
                    logger.warn(' getStorageDate ' + 'failed');
                    resUtil.resetFailedRes(res,"仓库车位不为空，禁止停用");
                    return next();
                }
            }
        })
    }).seq(function () {
        storageDAO.updateStorageStatus(params,function(error,result){
            if (error) {
                logger.error(' updateStorageStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateStorageStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


function getStorageCarCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "制造商" + ',' + "起始地城市" + ','+ "目的地城市" + ','+ "经销商"+ ','+ "委托方" + ','+ "指令时间" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    carDAO.getCarList(params,function(error,rows){
        if (error) {
            logger.error(' queryCarList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                parkObj.routeStart = rows[i].route_start;
                parkObj.routeEnd = rows[i].route_end;
                parkObj.receiveName = rows[i].receive_name;
                parkObj.entrustName = rows[i].entrust_name;
                parkObj.orderDate = new Date(rows[i].order_date).toLocaleDateString();
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.routeStart+","+parkObj.routeEnd+","+parkObj.receiveName+","+parkObj.entrustName+","+parkObj.orderDate+ '\r\n';
            }
                var csvBuffer = new Buffer(csvString,'utf8');
                res.set('content-type', 'application/csv');
                res.set('charset', 'utf8');
                res.set('content-length', csvBuffer.length);
                res.writeHead(200);
                res.write(csvBuffer);//TODO
                res.end();
                return next(false);
        }
    })
}

module.exports = {
    createStorage : createStorage,
    queryStorage : queryStorage,
    queryStorageDate : queryStorageDate,
    queryStorageParkingCount : queryStorageParkingCount,
    queryStorageCount : queryStorageCount,
    queryStorageTotalMonth : queryStorageTotalMonth,
    queryStorageTotalDay : queryStorageTotalDay,
    updateStorage : updateStorage,
    updateStorageStatus : updateStorageStatus,
    getStorageCarCsv : getStorageCarCsv
}