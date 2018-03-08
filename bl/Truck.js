/**
 * Created by zwl on 2017/3/14.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var truckDAO = require('../dao/TruckDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
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
                req.params.vhe = params.truckNum;
                req.params.truckOp =sysConst.RECORD_OP_TYPE.truckOp;
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
                req.params.vhe = params.truckNum;
                req.params.truckOp =sysConst.RECORD_OP_TYPE.truckOp;
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

function queryTruckBase(req,res,next){
    var params = req.params ;
    truckDAO.getTruckBase(params,function(error,result){
        if (error) {
            logger.error(' queryTruckBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckBase ' + 'success');
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

function queryTruckTypeCountTotal(req,res,next){
    var params = req.params ;
    truckDAO.getTruckTypeCountTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckTypeCountTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckTypeCountTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryTruckOperateTypeCountTotal(req,res,next){
    var params = req.params ;
    truckDAO.getTruckOperateTypeCountTotal(params,function(error,result){
        if (error) {
            logger.error(' queryTruckOperateTypeCountTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckOperateTypeCountTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruck(req,res,next){
    var params = req.params ;
    if(params.number == null || params.number == ""){
        params.number = 0;
    }
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
    if(params.imageType==1){
        truckDAO.updateTruckDrivingImage(params,function(error,result){
            if (error) {
                logger.error(' updateTruckDrivingImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckDrivingImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
    if(params.imageType==2){
        truckDAO.updateTruckLicenseImage(params,function(error,result){
            if (error) {
                logger.error(' updateTruckLicenseImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckLicenseImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
    if(params.imageType==3){
        truckDAO.updateTruckInspectImage(params,function(error,result){
            if (error) {
                logger.error(' updateTruckInspectImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckInspectImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
}

function updateTruckRelBind(req,res,next){
    var params = req.params ;
    var parkObj = {};
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
                }else if(rows && rows.length>0&&rows[0].truck_status==0){
                    logger.warn(' getTruckBase ' +params.truckId+ ' 头车已被停用，不能进行绑定 ');
                    resUtil.resetFailedRes(res,' 头车已被停用，不能进行绑定 ');
                    return next();
                }else{
                    parkObj.truckId = rows[0].id;
                    parkObj.truckNum = rows[0].truck_num;
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        truckDAO.getTruckTrailer({trailId:params.trailId},function(error,rows){
            if (error) {
                logger.error(' getTruckTrailer ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(params.trailId>0){
                    if(rows && rows.length>0&&rows[0].first_num!=null){
                        logger.warn(' getTruckTrailer ' +params.trailId+ sysMsg.CUST_TRUCK_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                        return next();
                    }else if(rows && rows.length>0&&rows[0].truck_status==0){
                        logger.warn(' getTruckTrailer ' +params.truckId+ ' 挂车已被停用，不能进行绑定 ');
                        resUtil.resetFailedRes(res,' 挂车已被停用，不能进行绑定 ');
                        return next();
                    }else{
                        parkObj.firstNum = rows[0].truck_num;
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
                    req.params.truckContent =" 头车车牌号 "+parkObj.truckNum+ " 与 挂车车牌号 " +parkObj.firstNum+ " 关联 ";
                    req.params.vhe = parkObj.truckNum;
                    req.params.truckOp =sysConst.RECORD_OP_TYPE.truckOp;
                    resUtil.resetUpdateRes(res, result, null);
                    return next();
                }
            })
    })
}

function updateTruckRelUnBind(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckFirst({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckFirst ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].rel_id==params.trailId){
                    parkObj.truckId = rows[0].id;
                    parkObj.truckNum = rows[0].truck_num;
                    parkObj.trailNum = rows[0].trail_num;
                    that();
                }else{
                    logger.warn(' getTruckFirst ' +params.truckId+ sysMsg.CUST_TRUCK_UNBIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_UNBIND);
                    return next();

                }
            }
        })
    }).seq(function(){
        params.trailId = 0;
        truckDAO.updateTruckRel(params, function (error, result) {
            if (error) {
                logger.error(' updateTruckRelUnBind ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckRelUnBind ' + 'success');
                req.params.truckContent =" 头车车牌号 "+parkObj.truckNum+ " 与 挂车车牌号 " +parkObj.trailNum+ " 解绑 ";
                req.params.vhe = parkObj.truckNum;
                req.params.truckOp =sysConst.RECORD_OP_TYPE.truckOp;
                resUtil.resetUpdateRes(res, result, null);
                return next();
            }
        })
    })
}

function updateTruckDriveRelBind(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckFirst({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckFirst ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].drive_id>0){
                    logger.warn(' getTruckFirst ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                    return next();
                }else if(rows && rows.length>0&&rows[0].truck_type==2){
                    logger.warn(' getTruckFirst ' +params.truckId+ ' 司机不能与挂车绑定 ');
                    resUtil.resetFailedRes(res,' 司机不能与挂车绑定 ');
                    return next();
                }else if(rows && rows.length>0&&rows[0].truck_status==0){
                    logger.warn(' getTruckFirst ' +params.truckId+ ' 头车已被停用，不能进行绑定 ');
                    resUtil.resetFailedRes(res,' 头车已被停用，不能进行绑定 ');
                    return next();
                }else{
                    parkObj.truckId = rows[0].id;
                    parkObj.truckNum = rows[0].truck_num;
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        driveDAO.getDrive({driveId:params.driveId},function(error,rows){
            if (error) {
                logger.error(' getDrive ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&params.driveId>0){
                    if(rows[0].truck_num!=null || rows[0].vice!=null){
                        logger.warn(' getDrive ' +params.driveId+ sysMsg.CUST_DRIVE_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_DRIVE_BIND);
                        return next();
                    }else if(rows && rows.length>0&&rows[0].drive_status==0){
                        logger.warn(' getDrive ' +params.driveId+ ' 司机已被停用，不能进行绑定 ');
                        resUtil.resetFailedRes(res,' 司机已被停用，不能进行绑定 ');
                        return next();
                    }else{
                        parkObj.driveId = rows[0].id;
                        parkObj.driveName = rows[0].drive_name;
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
                req.params.truckContent =" 头车车牌号 "+parkObj.truckNum+ " 与主驾司机 " +parkObj.driveName+ " 关联 ";
                req.params.vhe = parkObj.truckNum;
                req.params.truckOp =sysConst.RECORD_OP_TYPE.truckOp;
                req.params.driverContent =" 主驾司机 "+parkObj.driveName+ " 与头车车牌号 " +parkObj.truckNum+ " 关联 ";
                req.params.tid = parkObj.driveId;
                req.params.driverOp =sysConst.RECORD_OP_TYPE.driverOp;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateTruckDriveRelUnBind(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckFirst({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckFirst ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].drive_id==params.driveId){
                    parkObj.truckId = rows[0].id;
                    parkObj.truckNum = rows[0].truck_num;
                    parkObj.driveId = rows[0].drive_id;
                    parkObj.driveName = rows[0].drive_name;
                    that();
                }else{
                    logger.warn(' getTruckFirst ' +params.truckId+ sysMsg.CUST_DRIVE_UNBIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_DRIVE_UNBIND);
                    return next();
                }
            }
        })
    }).seq(function(){
        params.driveId = 0;
        truckDAO.updateTruckDriveRel(params, function (error, result) {
            if (error) {
                logger.error(' updateTruckDriveRelUnBind ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckDriveRelUnBind ' + 'success');
                req.params.truckContent =" 头车车牌号 "+parkObj.truckNum+ " 与主驾司机 " +parkObj.driveName+ " 解绑 ";
                req.params.vhe = parkObj.truckNum;
                req.params.truckOp =sysConst.RECORD_OP_TYPE.truckOp;
                req.params.driverContent =" 主驾司机 "+parkObj.driveName+ " 与头车车牌号 " +parkObj.truckNum+ " 解绑 ";
                req.params.tid = parkObj.driveId;
                req.params.driverOp =sysConst.RECORD_OP_TYPE.driverOp;
                resUtil.resetUpdateRes(res, result, null);
                return next();
            }
        })
    })
}

function updateTruckViceDriveRelBind(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckFirst({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckFirst ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].vice_drive_id>0){
                    logger.warn(' getTruckFirst ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                    return next();
                }else if(rows && rows.length>0&&rows[0].truck_type==2){
                    logger.warn(' getTruckFirst ' +params.truckId+ ' 司机不能与挂车绑定 ');
                    resUtil.resetFailedRes(res,' 司机不能与挂车绑定 ');
                    return next();
                }else if(rows && rows.length>0&&rows[0].truck_status==0){
                    logger.warn(' getTruckFirst ' +params.truckId+ ' 头车已被停用，不能进行绑定 ');
                    resUtil.resetFailedRes(res,' 头车已被停用，不能进行绑定 ');
                    return next();
                }else{
                    parkObj.truckId = rows[0].id;
                    parkObj.truckNum = rows[0].truck_num;
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        driveDAO.getDrive({viceDriveId:params.viceDriveId},function(error,rows){
            if (error) {
                logger.error(' getDrive ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&params.viceDriveId>0){
                    if(rows[0].truck_num!=null || rows[0].vice!=null){
                        logger.warn(' getDrive ' +params.viceDriveId+ sysMsg.CUST_DRIVE_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_DRIVE_BIND);
                        return next();
                    }else if(rows && rows.length>0&&rows[0].drive_status==0){
                        logger.warn(' getDrive ' +params.viceDriveId+ ' 司机已被停用，不能进行绑定 ');
                        resUtil.resetFailedRes(res,' 司机已被停用，不能进行绑定 ');
                        return next();
                    }else{
                        parkObj.viceDriveId = rows[0].id;
                        parkObj.driveName = rows[0].drive_name;
                        that();
                    }
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        truckDAO.updateTruckViceDriveRel(params,function(error,result){
            if (error) {
                logger.error(' updateTruckViceDriveRelBind ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckViceDriveRelBind ' + 'success');
                req.params.truckContent =" 头车车牌号 "+parkObj.truckNum+ " 与副驾司机 " +parkObj.driveName+ " 关联 ";
                req.params.vhe = parkObj.truckNum;
                req.params.truckOp =sysConst.RECORD_OP_TYPE.truckOp;
                req.params.driverContent =" 副驾司机 "+parkObj.driveName+ " 与头车车牌号 " +parkObj.truckNum+ " 关联 ";
                req.params.tid = parkObj.viceDriveId;
                req.params.driverOp =sysConst.RECORD_OP_TYPE.driverOp;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateTruckViceDriveRelUnBind(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        truckDAO.getTruckFirst({truckId:params.truckId},function(error,rows){
            if (error) {
                logger.error(' getTruckFirst ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].vice_drive_id==params.viceDriveId){
                    parkObj.truckId = rows[0].id;
                    parkObj.truckNum = rows[0].truck_num;
                    parkObj.viceDriveId = rows[0].vice_drive_id;
                    parkObj.driveName = rows[0].drive_name;
                    that();
                }else{
                    logger.warn(' getTruckFirst ' +params.truckId+ sysMsg.CUST_DRIVE_UNBIND);
                    resUtil.resetFailedRes(res,sysMsg.CUST_DRIVE_UNBIND);
                    return next();
                }
            }
        })
    }).seq(function(){
        params.viceDriveId = 0;
        truckDAO.updateTruckViceDriveRel(params, function (error, result) {
            if (error) {
                logger.error(' updateTruckViceDriveRelUnBind ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckViceDriveRelUnBind ' + 'success');
                req.params.truckContent =" 头车车牌号 "+parkObj.truckNum+ " 与副驾司机 " +parkObj.driveName+ " 解绑 ";
                req.params.vhe = parkObj.truckNum;
                req.params.truckOp =sysConst.RECORD_OP_TYPE.truckOp;
                req.params.driverContent =" 副驾司机 "+parkObj.driveName+ " 与头车车牌号 " +parkObj.truckNum+ " 解绑 ";
                req.params.tid = parkObj.viceDriveId;
                req.params.driverOp =sysConst.RECORD_OP_TYPE.driverOp;
                resUtil.resetUpdateRes(res, result, null);
                return next();
            }
        })
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
                if(rows && rows.length>0){
                    if(rows[0].drive_id>0 || rows[0].vice_drive_id>0){
                        logger.warn(' getTruckBase ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
                        return next();
                    } else if(rows[0].rel_id>0){
                        logger.warn(' getTruckBase ' +params.truckId+ sysMsg.CUST_TRUCK_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_TRUCK_BIND);
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

function updateRepairStatus(req,res,next){
    var params = req.params ;
    truckDAO.updateRepairStatus(params,function(error,result){
        if (error) {
            logger.error(' updateRepairStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateRepairStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getTruckFirstCsv(req,res,next){
    var csvString = "";
    var header = "货车牌号" + ',' + "品牌" + ',' + "关联挂车号" + ',' + "挂车货位" + ','+ "联系电话" + ','+ "主驾司机"+ ','+ "副驾司机" + ','+ "所属类型" + ','+ "所属公司" + ','+ "货车状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    truckDAO.getTruckFirst(params,function(error,rows){
        if (error) {
            logger.error(' queryTruckFirst ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.truckNum = rows[i].truck_num;
                parkObj.brandName = rows[i].brand_name;
                parkObj.trailNum = rows[i].trail_num;
                parkObj.trailNumber = rows[i].trail_number;
                parkObj.truckTel = rows[i].truck_tel;
                parkObj.driveName = rows[i].drive_name;
                parkObj.viceDriveName = rows[i].vice_drive_name;
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else if(rows[i].operate_type == 2){
                    parkObj.operateType = "外协";
                }else if(rows[i].operate_type == 3){
                    parkObj.operateType = "供方";
                }else{
                    parkObj.operateType = "承包";
                }
                parkObj.companyName = rows[i].company_name;
                if(rows[i].truck_status == 1){
                    parkObj.truckStatus = "可用";
                }else{
                    parkObj.truckStatus = "停用";
                }
                csvString = csvString+parkObj.truckNum+","+parkObj.brandName+","+parkObj.trailNum+"," +parkObj.trailNumber+"," +parkObj.truckTel+","
                    +parkObj.driveName+"," +parkObj.viceDriveName+","+parkObj.operateType+","+parkObj.companyName+","+parkObj.truckStatus+ '\r\n';
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
    createTruckFirst : createTruckFirst,
    createTruckTrailer : createTruckTrailer,
    queryTruckFirst : queryTruckFirst,
    queryTruckTrailer : queryTruckTrailer,
    queryTruckBase : queryTruckBase,
    queryOperateTypeCount : queryOperateTypeCount,
    queryTruckCount : queryTruckCount,
    queryDrivingCount : queryDrivingCount,
    queryFirstCount : queryFirstCount,
    queryTrailerCount : queryTrailerCount,
    queryTruckTypeCountTotal : queryTruckTypeCountTotal,
    queryTruckOperateTypeCountTotal : queryTruckOperateTypeCountTotal,
    updateTruck : updateTruck,
    updateTruckImage : updateTruckImage,
    updateTruckRelBind : updateTruckRelBind,
    updateTruckRelUnBind : updateTruckRelUnBind,
    updateTruckDriveRelBind : updateTruckDriveRelBind,
    updateTruckDriveRelUnBind : updateTruckDriveRelUnBind,
    updateTruckViceDriveRelBind : updateTruckViceDriveRelBind,
    updateTruckViceDriveRelUnBind :updateTruckViceDriveRelUnBind,
    updateTruckStatusFirst : updateTruckStatusFirst,
    updateTruckStatusTrailer : updateTruckStatusTrailer,
    updateRepairStatus : updateRepairStatus,
    getTruckFirstCsv : getTruckFirstCsv
}