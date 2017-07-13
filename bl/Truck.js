/**
 * Created by zwl on 2017/3/14.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Truck.js');

function createTruck(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckBase({relId:params.relId},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(params.relId>0){
                    if(rows && rows.length>0){
                        logger.warn(' getTruckBase ' +params.relId+ sysMsg.CUST_TRUCK_RELATION);
                        resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_RELATION);
                        return next();
                    }else{
                        that();
                    }
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        truckDAO.getTruckBase({driveId:params.driveId},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(params.driveId>0){
                    if(rows && rows.length>0){
                        logger.warn(' getTruckBase ' +params.driveId+ sysMsg.CUST_DRIVE_RELATION);
                        resUtil.resetFailedRes(res,sysMsg.CUST_DRIVE_RELATION);
                        return next();
                    }else{
                        that();
                    }
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        if(params.number == null){
            params.number = 0;
        }
        truckDAO.addTruck(params,function(error,result){
            if (error) {
                logger.error(' createTruck ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createTruck ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryTruckFirst(req,res,next){
    var params = req.params ;
    truckDAO.getTruckFirst(params,function(error,result){
        if (error) {
            logger.error(' queryTruckFirst ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckFirst ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckTrailer(req,res,next){
    var params = req.params ;
    truckDAO.getTruckTrailer(params,function(error,result){
        if (error) {
            logger.error(' queryTruckTrailer ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckTrailer ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryOperateTypeCount(req,res,next){
    var params = req.params ;
    truckDAO.getOperateTypeCount(params,function(error,result){
        if (error) {
            logger.error(' queryOperateTypeCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryOperateTypeCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckCount(req,res,next){
    var params = req.params ;
    truckDAO.getTruckCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDrivingCount(req,res,next){
    var params = req.params ;
    truckDAO.getDrivingCount(params,function(error,result){
        if (error) {
            logger.error(' queryDrivingCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrivingCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckStatusCount(req,res,next){
    var params = req.params ;
    truckDAO.getTruckStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryTruckStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryFirstCount(req,res,next){
    var params = req.params ;
    truckDAO.getFirstCount(params,function(error,result){
        if (error) {
            logger.error(' queryFirstCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryFirstCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTrailerCount(req,res,next){
    var params = req.params ;
    truckDAO.getTrailerCount(params,function(error,result){
        if (error) {
            logger.error(' queryTrailerCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTrailerCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruck(req,res,next){
    var params = req.params ;
        truckDAO.updateTruck(params,function(error,result){
            if (error) {
                logger.error(' updateTruck ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruck ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
}

function updateTruckImage(req,res,next){
    var params = req.params ;
    truckDAO.updateTruckImage(params,function(error,result){
        if (error) {
            logger.error(' updateTruckImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckImage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckRel(req,res,next){
    var params = req.params ;
    truckDAO.updateTruckRel(params,function(error,result){
        if (error) {
            logger.error(' updateTruckRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckDriveRel(req,res,next){
    var params = req.params ;
    truckDAO.updateTruckDriveRel(params,function(error,result){
        if (error) {
            logger.error(' updateTruckDriveRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckDriveRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateTruckStatus (req,res,next){
    var params = req.params;
    truckDAO.updateTruckStatus(params,function(error,result){
        if (error) {
            logger.error(' updateTruckStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruck : createTruck,
    queryTruckFirst : queryTruckFirst,
    queryTruckTrailer : queryTruckTrailer,
    queryOperateTypeCount : queryOperateTypeCount,
    queryTruckCount : queryTruckCount,
    queryDrivingCount : queryDrivingCount,
    queryTruckStatusCount : queryTruckStatusCount,
    queryFirstCount : queryFirstCount,
    queryTrailerCount : queryTrailerCount,
    updateTruck : updateTruck,
    updateTruckImage : updateTruckImage,
    updateTruckRel : updateTruckRel,
    updateTruckDriveRel : updateTruckDriveRel,
    updateTruckStatus : updateTruckStatus
}