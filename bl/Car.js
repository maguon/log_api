/**
 * Created by zwl on 2017/4/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Car.js');

function createUploadCar(req,res,next){
    var params = req.params ;
    carDAO.addUploadCar(params,function(error,result){
        if (error) {
            logger.error(' createUploadCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createUploadCar ' + 'success ');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function createCar(req,res,next){
    var params = req.params ;
    var carId = 0;
    if(params.orderDate!=null){
        var orderDate = params.orderDate;
        var strDate = moment(orderDate).format('YYYYMMDD');
        params.orderDateId = parseInt(strDate);
    }
    if(params.routeEndId!=null){
        if(params.routeStartId>params.routeEndId){
            params.routeId = params.routeEndId+''+params.routeStartId;
        }else{
            params.routeId = params.routeStartId+''+params.routeEndId;
        }
    }else{
        params.routeId = 0;
    }
    carDAO.addCar(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "本条数据已经存在，请核对后重新录入");
                return next();
            } else{
                logger.error(' createCar ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createCar ' + 'success');
            req.params.carContent =" 商品车信息录入 ";
            carId = result.insertId;
            req.params.carId = carId;
            req.params.op =10;
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCarList(req,res,next){
    var params = req.params ;
    carDAO.getCarList(params,function(error,result){
        if (error) {
            logger.error(' queryCarList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCar(req,res,next){
    var params = req.params ;
    carDAO.getCar(params,function(error,result){
        if (error) {
            logger.error(' queryCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarRouteEndCount(req,res,next){
    var params = req.params ;
    carDAO.getCarRouteEndCount(params,function(error,result){
        if (error) {
            logger.error(' queryCarRouteEndCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarRouteEndCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarOrderDateCount(req,res,next){
    var params = req.params ;
    carDAO.getCarOrderDateCount(params,function(error,result){
        if (error) {
            logger.error(' queryCarOrderDateCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarOrderDateCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarReceiveCount(req,res,next){
    var params = req.params ;
    carDAO.getCarReceiveCount(params,function(error,result){
        if (error) {
            logger.error(' queryCarReceiveCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarReceiveCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarMonthStat(req,res,next){
    var params = req.params ;
    carDAO.getCarMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryCarMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarDayStat(req,res,next){
    var params = req.params ;
    carDAO.getCarDayStat(params,function(error,result){
        if (error) {
            logger.error(' queryCarDayStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarDayStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCar(req,res,next){
    var params = req.params ;
    if(params.orderDate==null){
        params.orderDateId = null;
    }else{
        var orderDate = params.orderDate;
        var strDate = moment(orderDate).format('YYYYMMDD');
        params.orderDateId = parseInt(strDate);
    }
    if(params.routeEndId!=null){
        if(params.routeStartId>params.routeEndId){
            params.routeId = params.routeEndId+''+params.routeStartId;
        }else{
            params.routeId = params.routeStartId+''+params.routeEndId;
        }
    }else{
        params.routeId = 0;
    }
    carDAO.updateCar(params,function(error,result){
        if (error) {
            logger.error(' updateCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCar ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCarVin(req,res,next){
    var params = req.params ;
    carDAO.updateCarVin(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "本条数据已经存在，请核对后重新操作");
                return next();
            } else{
                logger.error(' createCar ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' updateCarVin ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCarStatus(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        carDAO.getCarBase({carId:params.carId},function(error,rows){
            if (error) {
                logger.error(' getCarBase ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].rel_status!=null){
                    logger.warn(' getCarBase ' +params.carId+ sysMsg.CUST_CREATE_EXISTING);
                    resUtil.resetFailedRes(res,sysMsg.CUST_CREATE_EXISTING);
                    return next();
                }else{
                    parkObj.vin = rows[0].vin;
                    that();
                }
            }
        })
    }).seq(function () {
        carDAO.updateCarStatus(params,function(error,result){
            if (error) {
                logger.error(' updateCarStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCarStatus ' + 'success');
                req.params.carContent =" 直发送达 ";
                req.params.vin =parkObj.vin;
                req.params.op =19;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

module.exports = {
    createUploadCar : createUploadCar,
    createCar : createCar,
    queryCarList : queryCarList,
    queryCar : queryCar,
    queryCarRouteEndCount : queryCarRouteEndCount,
    queryCarOrderDateCount : queryCarOrderDateCount,
    queryCarReceiveCount : queryCarReceiveCount,
    queryCarMonthStat : queryCarMonthStat,
    queryCarDayStat : queryCarDayStat,
    updateCar : updateCar,
    updateCarVin : updateCarVin,
    updateCarStatus : updateCarStatus
}
