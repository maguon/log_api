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

function createTruckFirst(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckBase({truckNum:params.truckNum},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getTruckBase ' +params.truckNum+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        truckDAO.addTruckFirst(params,function(error,result){
            if (error) {
                logger.error(' createTruckFirst ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createTruckFirst ' + 'success');
                req.params.truckContent =" 新增车头 ";
                req.params.vhe = result.insertId;
                req.params.truckOp =20;
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function createTruckTrailer(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckBase({truckNum:params.truckNum},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' getTruckBase ' +params.truckNum+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        truckDAO.addTruckTrailer(params,function(error,result){
            if (error) {
                logger.error(' createTruckTrailer ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createTruckTrailer ' + 'success');
                req.params.truckContent =" 新增挂车 ";
                req.params.vhe = result.insertId;
                req.params.truckOp =20;
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

function updateTruckRelBind(req,res,next){
    var params = req.params ;
    var truckId = 0;
    var truckNum = "";
    var firstNum = "";
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckBase({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].rel_id>0){
                    logger.warn(' getTruckBase ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                    return next();
                }else{
                    truckId = rows[0].id;
                    truckNum = rows[0].truck_num;
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        truckDAO.getTruckTrailer({relId:params.relId},function(error,rows){
            if (error) {
                logger.error(' getTruckTrailer ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(params.relId>0){
                    if(rows && rows.length>0&&rows[0].first_num!=null){
                        logger.warn(' getTruckTrailer ' +params.relId+ sysMsg.CUST_TRUCK_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                        return next();
                    }else{
                        firstNum = rows[0].truck_num;
                        that();
                    }
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
            truckDAO.updateTruckRel(params, function (error, result) {
                if (error) {
                    logger.error(' updateTruckRelBind ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' updateTruckRelBind ' + 'success');
                    req.params.truckContent =" 头车车牌号 "+truckNum+ " 与 挂车车牌号 " +firstNum+ " 关联 ";
                    req.params.vhe = truckId;
                    req.params.truckOp =20;
                    resUtil.resetUpdateRes(res, result, null);
                    return next();
                }
            })
    })
}

function updateTruckRelUnBind(req,res,next){
    var params = req.params ;
    var truckId = 0;
    var truckNum = "";
    var trailNum = "";
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckFirst({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckFirst ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].rel_id==0){
                    logger.warn(' getTruckFirst ' +params.truckId+ sysMsg.CUST_TRUCK_UNBIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_UNBIND);
                    return next();
                }else{
                    truckId = rows[0].id;
                    truckNum = rows[0].truck_num;
                    trailNum = rows[0].trail_num;
                    that();
                }
            }
        })
    }).seq(function(){
        truckDAO.updateTruckRel(params, function (error, result) {
            if (error) {
                logger.error(' updateTruckRelUnBind ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckRelUnBind ' + 'success');
                req.params.truckContent =" 头车车牌号 "+truckNum+ " 与 挂车车牌号 " +trailNum+ " 解绑 ";
                req.params.vhe = truckId;
                req.params.truckOp =20;
                resUtil.resetUpdateRes(res, result, null);
                return next();
            }
        })
    })
}

function updateTruckDriveRelBind(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckBase({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].drive_id>0){
                    logger.warn(' getTruckBase ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                    return next();
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
                        logger.warn(' getTruckBase ' +params.driveId+ sysMsg.CUST_DRIVE_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_DRIVE_BIND);
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
        truckDAO.updateTruckDriveRel(params,function(error,result){
            if (error) {
                logger.error(' updateTruckDriveRelBind ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckDriveRelBind ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateTruckDriveRelUnBind(req,res,next){
    var params = req.params ;
    truckDAO.updateTruckDriveRel(params, function (error, result) {
        if (error) {
            logger.error(' updateTruckDriveRelUnBind ' + error.message);
            throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckDriveRelUnBind ' + 'success');
            resUtil.resetUpdateRes(res, result, null);
            return next();
        }
    })
}

function updateTruckStatusFirst(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckBase({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].drive_id>0){
                    logger.warn(' getTruckBase ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                    return next();
                }else if(rows && rows.length>0&&rows[0].rel_id>0){
                    logger.warn(' getTruckBase ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        truckDAO.updateTruckStatus(params,function(error,result){
            if (error) {
                logger.error(' updateTruckStatusFirst ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckStatusFirst ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateTruckStatusTrailer(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckTrailer({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckTrailer ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                    if(rows && rows.length>0&&rows[0].first_num!=null){
                        logger.warn(' getTruckTrailer ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                        return next();
                    }else{
                        that();
                    }
            }
        })
    }).seq(function(){
        truckDAO.updateTruckStatus(params,function(error,result){
            if (error) {
                logger.error(' updateTruckStatusTrailer ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckStatusTrailer ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

module.exports = {
    createTruckFirst : createTruckFirst,
    createTruckTrailer : createTruckTrailer,
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
    updateTruckRelBind : updateTruckRelBind,
    updateTruckRelUnBind : updateTruckRelUnBind,
    updateTruckDriveRelBind : updateTruckDriveRelBind,
    updateTruckDriveRelUnBind : updateTruckDriveRelUnBind,
    updateTruckStatusFirst : updateTruckStatusFirst,
    updateTruckStatusTrailer : updateTruckStatusTrailer
}