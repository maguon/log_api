/**
 * Created by zwl on 2017/4/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var carDAO = require('../dao/CarDAO.js');
var cityDAO = require('../dao/CityDAO.js');
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
    carDAO.addCar(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "本条数据已经存在，请核对后重新录入");
                return next();
            } else{
                logger.error(' createCar ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createCar ' + 'success');
            req.params.carContent =" 商品车信息录入 ";
            carId = result.insertId;
            req.params.carId = carId;
            req.params.op =sysConst.CAR_OP_TYPE.CREATE_CAR;
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

function queryCarDamageDeclare(req,res,next){
    var params = req.params ;
    carDAO.getCarDamageDeclare(params,function(error,result){
        if (error) {
            logger.error(' queryCarDamageDeclare ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarDamageDeclare ' + 'success');
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
                logger.error(' createCar ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
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

function removeUploadCar(req,res,next){
    var params = req.params ;
    params.carStatus = listOfValue.CAR_STATUS_MOVE;
    carDAO.deleteUploadCar(params,function(error,result){
        if (error) {
            logger.error(' removeUploadCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeUploadCar ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getCarRelCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "制造商" + ',' + "入库时间" + ','+ "存放车库" + ','+ "存放区域"+ ','+ "存放位置" + ','+ "实际出库时间" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    carDAO.getCar(params,function(error,rows){
        if (error) {
            logger.error(' getCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                if(rows[i].enter_time == null){
                    parkObj.enterTime = "";
                }else{
                    parkObj.enterTime = new Date(rows[i].enter_time).toLocaleDateString();
                }
                if(rows[i].storage_name == null){
                    parkObj.storageName = "";
                }else{
                    parkObj.storageName = rows[i].storage_name;
                }
                if(rows[i].area_name == null){
                    parkObj.areaName = "";
                }else{
                    parkObj.areaName = rows[i].area_name;
                }
                if(rows[i].row == null){
                    parkObj.rowCol = "";
                }else{
                    parkObj.rowCol = rows[i].row+"排"+rows[i].col+"列";
                }
                if(rows[i].real_out_time == null){
                    parkObj.realOutTime = "";
                }else{
                    parkObj.realOutTime = new Date(rows[i].real_out_time).toLocaleDateString();
                }


                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.enterTime+","+parkObj.storageName+","+parkObj.areaName+","
                    +parkObj.rowCol+","+parkObj.realOutTime+ '\r\n';
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

function getCarListCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "制造商" + ',' +"委托方" + ',' + "发运地城市" + ','+ "发运地地址" + ','+ "目的地城市"+ ','+ "经销商" + ','+ "指令时间" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    carDAO.getCarList(params,function(error,rows){
        if (error) {
            logger.error(' getCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                if(rows[i].en_short_name == null){
                    parkObj.enShortName = "";
                }else{
                    parkObj.enShortName = rows[i].en_short_name;
                }
                if(rows[i].route_start == null){
                    parkObj.routeStart = "";
                }else{
                    parkObj.routeStart = rows[i].route_start;
                }
                if(rows[i].addr_name == null){
                    parkObj.addrName = "";
                }else{
                    parkObj.addrName = rows[i].addr_name;
                }
                if(rows[i].route_end == null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                if(rows[i].re_short_name == null){
                    parkObj.reShortName = "";
                }else{
                    parkObj.reShortName = rows[i].re_short_name;
                }
                if(rows[i].order_date == null){
                    parkObj.orderDate = "";
                }else{
                    parkObj.orderDate = new Date(rows[i].order_date).toLocaleDateString();
                }
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.enShortName+","+parkObj.routeStart+","+parkObj.addrName+","
                    +parkObj.routeEnd+","+parkObj.reShortName+","+parkObj.orderDate+ '\r\n';
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
//外部使用接口
function createEntrustCar(req,res,next){
    var params = req.params ;
    var carObj = {};
    var carId = 0;
    Seq().seq(function(){
        var that = this;
        if(params.routeStart !=null && params.routeStart != ''){
            params.cityName = params.routeStart;
        }
        cityDAO.getCity(params,function(error,rows){
            if (error) {
                logger.error(' getCity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    carObj.routeStartId = rows[0].id;
                    that();
                }else{
                    logger.warn(' getCity ' + 'failed');
                    resUtil.resetFailedRes(res," 城市不存在,请先设置城市 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.routeStartId = carObj.routeStartId;
        carDAO.addCar(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "本条数据已经存在，请核对后重新录入");
                    return next();
                } else{
                    logger.error(' createCar ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                logger.info(' createCar ' + 'success');
                req.params.carContent =" 商品车信息录入 ";
                carId = result.insertId;
                req.params.carId = carId;
                req.params.op =sysConst.CAR_OP_TYPE.CREATE_CAR;
                resUtil.resetCreateRes(res,result,null);
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
    queryCarDamageDeclare : queryCarDamageDeclare,
    updateCar : updateCar,
    updateCarVin : updateCarVin,
    updateCarStatus : updateCarStatus,
    removeUploadCar : removeUploadCar,
    getCarRelCsv : getCarRelCsv,
    getCarListCsv : getCarListCsv,
    createEntrustCar : createEntrustCar
}
