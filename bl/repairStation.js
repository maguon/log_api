/**
 * Created by zwl on 2018/1/31.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var repairStationDAO = require('../dao/repairStationDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('repairStation.js');

function createRepairStation(req,res,next){
    var params = req.params ;
    repairStationDAO.addRepairStation(params,function(error,result){
        if (error) {
            logger.error(' createRepairStation ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createRepairStation ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryRepairStation(req,res,next){
    var params = req.params ;
    repairStationDAO.getRepairStation(params,function(error,result){
        if (error) {
            logger.error(' queryRepairStation ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRepairStation ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateRepairStation(req,res,next){
    var params = req.params ;
    repairStationDAO.updateRepairStation(params,function(error,result){
        if (error) {
            logger.error(' updateRepairStation ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateRepairStation ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateRepairStationStatus(req,res,next){
    var params = req.params ;
    repairStationDAO.updateRepairStationStatus(params,function(error,result){
        if (error) {
            logger.error(' updateRepairStationStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateRepairStationStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createRepairStation : createRepairStation,
    queryRepairStation : queryRepairStation,
    updateRepairStation : updateRepairStation,
    updateRepairStationStatus : updateRepairStationStatus
}
