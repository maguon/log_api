/**
 * Created by zwl on 2017/6/1.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var entrustDAO = require('../dao/EntrustDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Entrust.js');

function createEntrust(req,res,next){
    var params = req.params ;
    //params.secretKey = encrypt.getEntrustRandomKey();
    entrustDAO.addEntrust(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "委托方已经存在，请重新录入");
                return next();
            } else{
                logger.error(' createEntrust ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createEntrust ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryEntrust(req,res,next){
    var params = req.params ;
    entrustDAO.getEntrust(params,function(error,result){
        if (error) {
            logger.error(' queryEntrust ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrust ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryEntrustRoute(req,res,next){
    var params = req.params ;
    entrustDAO.getEntrustRoute(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustRoute ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustRoute ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryEntrustCar(req,res,next){
    var params = req.params ;
    entrustDAO.getEntrustCar(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryEntrustPrice(req,res,next){
    var params = req.params ;
    entrustDAO.getEntrustPrice(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustPrice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustPrice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryEntrustCarCount(req,res,next){
    var params = req.params ;
    entrustDAO.getEntrustCarCount(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustCarCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustCarCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryEntrustCarNotCount(req,res,next){
    var params = req.params ;
    entrustDAO.getEntrustCarNotCount(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustCarNotCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustCarNotCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateEntrust(req,res,next){
    var params = req.params ;
    entrustDAO.updateEntrust(params,function(error,result){
        if (error) {
            logger.error(' updateEntrust ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateEntrust ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateEntrustCarParkingFee(req,res,next){
    var params = req.params ;
    entrustDAO.updateEntrustCarParkingFee(params,function(error,result){
        if (error) {
            logger.error(' updateEntrustCarParkingFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateEntrustCarParkingFee ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getEntrustPriceCsv(req,res,next){
    var csvString = "";
    var header = "委托方ID"+ ',' +"委托方简称"+ ',' +"车辆数"+ ',' +"一级估值"+ ','+"二级估值";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    entrustDAO.getEntrustPrice(params,function(error,rows){
        if (error) {
            logger.error(' getEntrustPriceCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.entrustId = rows[i].entrust_id;
                parkObj.entrustCarCount = rows[i].entrust_car_count;
                if(rows[i].short_name == null){
                    parkObj.shortName = "";
                }else{
                    parkObj.shortName = rows[i].short_name;
                }
                parkObj.entrustCarPrice = rows[i].entrust_car_price;
                parkObj.entrustCarTwoPrice = rows[i].entrust_car_two_price;

                csvString = csvString+parkObj.entrustId+","+parkObj.entrustCarCount+","+parkObj.shortName+","+parkObj.entrustCarPrice+","+parkObj.entrustCarTwoPrice+ '\r\n';
            }
            var csvBuffer = new Buffer(csvString,'utf8');
            res.set('content-type', 'application/csv');
            res.set('charset', 'utf8');
            res.set('content-length', csvBuffer.length);
            res.writeHead(200);
            res.write(csvBuffer);
            res.end();
            return next(false);
        }
    })
}

function getEntrustCarCsv(req,res,next){
    var csvString = "";
    var header = "VIN"+ ',' +"品牌"+ ',' +"委托方"+ ',' +"始发城市"+ ','+"装车地点"+ ','+"目的城市"+ ','+"经销商"+ ','+"指令时间"+ ','+
        "公里数(公里)"+ ','+"价格(元)/公里"+ ','+"金额(元)"+ ','+"二级公里数(公里)"+ ','+"二级价格(元)/公里"+ ','+"二级金额(元)";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    var fees = 0;
    var twoFees = 0;
    entrustDAO.getEntrustCar(params,function(error,rows){
        if (error) {
            logger.error(' getEntrustCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                parkObj.eShortName = rows[i].e_short_name;
                parkObj.routeStart = rows[i].route_start;
                parkObj.addrName = rows[i].addr_name;
                if(rows[i].route_end == null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                if(rows[i].r_short_name == null){
                    parkObj.rShortName = "";
                }else{
                    parkObj.rShortName = rows[i].r_short_name;
                }
                if(rows[i].order_date == null){
                    parkObj.orderDate = "";
                }else{
                    parkObj.orderDate = new Date(rows[i].order_date).toLocaleDateString();
                }
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                if(rows[i].fee == null){
                    parkObj.fee = "";
                }else{
                    parkObj.fee = rows[i].fee;
                }
                fees = rows[i].distance*rows[i].fee;
                if(fees == 0){
                    parkObj.fees = "";
                }else{
                    parkObj.fees = fees;
                }
                if(rows[i].two_distance == null){
                    parkObj.twoDistance = "";
                }else{
                    parkObj.twoDistance = rows[i].two_distance;
                }
                if(rows[i].two_fee == null){
                    parkObj.twoFee = "";
                }else{
                    parkObj.twoFee = rows[i].two_fee;
                }
                twoFees = rows[i].two_distance*rows[i].two_fee;
                if(twoFees == 0){
                    parkObj.twoFees = "";
                }else{
                    parkObj.twoFees = twoFees;
                }
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.eShortName+","+parkObj.routeStart+","+parkObj.addrName+","+
                    parkObj.routeEnd+","+parkObj.rShortName+","+parkObj.orderDate+","+
                    parkObj.distance+","+parkObj.fee+","+parkObj.fees+","+
                    parkObj.twoDistance+","+parkObj.twoFee+","+parkObj.twoFees+ '\r\n';
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

function getEntrustNotCarCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "品牌" + ',' + "委托方"+ ',' + "始发城市" + ','+ "装车地点" + ','+ "目的城市"+ ','+ "经销商" + ','+ "指令时间" + ','+ "公里数(公里)" + ','+ "价格(元)/公里" + ','+ "金额(元)" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    var fees = 0;
    entrustDAO.getEntrustNotCar(params,function(error,rows){
        if (error) {
            logger.error(' getEntrustCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                parkObj.eShortName = rows[i].e_short_name;
                parkObj.routeStart = rows[i].route_start;
                parkObj.addrName = rows[i].addr_name;
                if(rows[i].route_end == null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                if(rows[i].r_short_name == null){
                    parkObj.rShortName = "";
                }else{
                    parkObj.rShortName = rows[i].r_short_name;
                }
                if(rows[i].order_date == null){
                    parkObj.orderDate = "";
                }else{
                    parkObj.orderDate = new Date(rows[i].order_date).toLocaleDateString();
                }
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                if(rows[i].fee == null){
                    parkObj.fee = "";
                }else{
                    parkObj.fee = rows[i].fee;
                }
                fees = rows[i].distance*rows[i].fee;
                if(fees == 0){
                    parkObj.fees = "";
                }else{
                    parkObj.fees = fees;
                }
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.eShortName+","+parkObj.routeStart+","+parkObj.addrName+","+parkObj.routeEnd
                    +","+parkObj.rShortName+","+parkObj.orderDate+","+parkObj.distance+","+parkObj.fee+","+parkObj.fees+ '\r\n';
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

function createSettleCarBatch(req,res,next){
    var params = req.params ;
    entrustDAO.addSettleCarBatch(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "数据已存在，请重新筛选");
                return next();
            } else{
                logger.error(' createSettleCarBatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            if(result&&result.insertId>0){
                logger.info(' createSettleCarBatch ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }else{
                resUtil.resetFailedRes(res," 数据已存在，请重新筛选 ");
                return next();
            }

        }
    })
}


module.exports = {
    createEntrust : createEntrust,
    queryEntrust : queryEntrust,
    queryEntrustRoute : queryEntrustRoute,
    queryEntrustCar : queryEntrustCar,
    queryEntrustCarCount : queryEntrustCarCount,
    queryEntrustCarNotCount : queryEntrustCarNotCount,
    updateEntrust : updateEntrust,
    updateEntrustCarParkingFee : updateEntrustCarParkingFee,
    queryEntrustPrice : queryEntrustPrice,
    getEntrustPriceCsv : getEntrustPriceCsv,
    getEntrustCarCsv : getEntrustCarCsv,
    getEntrustNotCarCsv : getEntrustNotCarCsv,
    createSettleCarBatch : createSettleCarBatch
}