/**
 * Created by zwl on 2019/7/8.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleOuterTruckDAO = require('../dao/SettleOuterTruckDAO.js');
var carMakeDAO = require('../dao/CarMakeDAO.js');
var cityDAO = require('../dao/CityDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterTruck.js');
var csv=require('csvtojson');
var fs = require('fs');

function createSettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.addSettleOuterTruck(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "此数据已存在，操作失败");
                return next();
            } else{
                logger.error(' createSettleOuterTruck ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createSettleOuterTruck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function querySettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.getSettleOuterTruck(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterTruck ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

// 查询结果下载
function getSettleOuterTruckBaseCsv(req, res, next) {
    var csvString = "";
    var header = "外协公司" + ',' +"品牌" + ',' + "起始城市" + ','+ "目的城市" + ','+ "公里数"+ ','+ "单价" + ','+"总价";

    csvString = header + '\r\n' + csvString;
    var params = req.params;
    var parkObj = {};
    settleOuterTruckDAO.getSettleOuterTruck(params,function(error,rows){
        if (error) {
            logger.error(' getSettleOuterTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                // 外协公司
                parkObj.companyName = rows[i].company_name;
                // 品牌
                parkObj.makeName = rows[i].make_name;
                // 起始城市
                if(rows[i].route_start == null){
                    parkObj.routeStart = "";
                }else{
                    parkObj.routeStart = rows[i].route_start;
                }
                // 目的城市
                if(rows[i].route_end == null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                // 公里数
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                // 单价
                if(rows[i].fee == null){
                    parkObj.fee = "";
                }else{
                    parkObj.fee = rows[i].fee;
                }
                // 总价
                parkObj.totalFee =rows[i].distance*rows[i].fee;

                // 一行数据
                csvString = csvString+parkObj.companyName+","+parkObj.makeName+","+parkObj.routeStart+","+parkObj.routeEnd+","+
                    parkObj.distance+","+parkObj.fee+","+parkObj.totalFee+ '\r\n';
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

// 批量数据导入
function uploadSettleOuterTruckFile(req,res,next){
    var params = req.params;
    var hasData  = false;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            Seq().seq(function(){
                var that = this;
                var subParams ={
                    makeId : objArray[i].制造商ID,
                    row : i+1,
                }
                carMakeDAO.getCarMake(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getCarMake ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.makeName = rows[0].make_name;
                        }else{
                            parkObj.makeName = "";
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    cityId : objArray[i].起始城市ID,
                    row : i+1,
                }
                cityDAO.getCity(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getCity ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.startCityName = rows[0].city_name;
                        }else{
                            parkObj.startCityName = "";
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    cityId : objArray[i].目的地ID,
                    row : i+1,
                }
                cityDAO.getCity(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getCity ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.endCityName = rows[0].city_name;
                        }else{
                            parkObj.endCityName = "";
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    companyId : objArray[i].外协公司ID,
                    makeId : objArray[i].制造商ID,
                    routeStartId : objArray[i].起始城市ID,
                    routeEndId : objArray[i].目的地ID,
                    row : i+1,
                }
                settleOuterTruckDAO.getSettleOuterTruck(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getSettleOuterTruck ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length>0){
                            hasData = true;
                        }else{
                            hasData = false;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(hasData){
                    var subParams ={
                        companyId : objArray[i].外协公司ID,
                        makeId : objArray[i].制造商ID,
                        routeStartId : objArray[i].起始城市ID,
                        routeEndId : objArray[i].目的地ID,
                        distance : objArray[i].公里数,
                        fee : objArray[i].单价,
                        row : i+1
                    }
                    settleOuterTruckDAO.updateSettleOuterTruck(subParams,function(err,result){
                        if (err) {
                            logger.error(' updateSettleOuterTruck ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result && result.affectedRows > 0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' updateSettleOuterTruck ' + 'success');
                            }else{
                                logger.warn(' updateSettleOuterTruck ' + 'failed');
                            }
                            that(null,i);
                        }
                    })
                }else{
                    var subParams ={
                        companyId : objArray[i].外协公司ID,
                        makeId : objArray[i].制造商ID,
                        makeName : parkObj.makeName,
                        routeStartId : objArray[i].起始城市ID,
                        routeStart : parkObj.startCityName,
                        routeEndId : objArray[i].目的地ID,
                        routeEnd : parkObj.endCityName,
                        distance : objArray[i].公里数,
                        fee : objArray[i].单价,
                        row : i+1
                    }
                    settleOuterTruckDAO.addSettleOuterTruckData(subParams,function(err,result){
                        if (err) {
                            logger.error(' addSettleOuterTruckData ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result&&result.affectedRows>0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' addSettleOuterTruckData ' + 'success');
                            }else{
                                logger.warn(' addSettleOuterTruckData ' + 'failed');
                            }
                            that(null,i);
                        }
                    })
                }
            })
        }).seq(function(){
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadSettleOuterTruckFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function querySettleOuterTruckList(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.getSettleOuterTruckList(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterTruckList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterTruckList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function querySettleOuterCarList(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.querySettleOuterCarList(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterCarList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterCarList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function querySettleOuterTruckCarCount(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.getSettleOuterTruckCarCount(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterTruckCarCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterTruckCarCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateSettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.updateSettleOuterTruck(params,function(error,result){
        if (error) {
            logger.error(' updateSettleOuterTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateSettleOuterTruck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getSettleOuterTruckCsv(req,res,next){
    var csvString = "";
    var header = "VIN"+ ',' +"品牌"+ ',' +"外协公司"+ ',' +"司机"+ ',' +"货车牌号"+ ',' +"委托方"+ ','+"始发城市"+ ','+"装车地点"+ ','+"目的城市"+ ','+
        "经销商"+ ','+"指令时间"+ ','+"调度日期"+ ','+"公里数(公里)"+ ','+"价格/公里"+ ','+"金额";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    var fees = 0;
    settleOuterTruckDAO.getSettleOuterTruckList(params,function(error,rows){
        if (error) {
            logger.error(' getSettleOuterTruckList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                parkObj.companyName = rows[i].company_name;
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].e_short_name == null){
                    parkObj.eShortName = "";
                }else{
                    parkObj.eShortName = rows[i].e_short_name;
                }
                parkObj.routeStart = rows[i].route_start;
                parkObj.addrName = rows[i].addr_name;
                parkObj.routeEnd = rows[i].route_end;
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
                if(rows[i].task_plan_date == null){
                    parkObj.taskPlanDate = "";
                }else{
                    parkObj.taskPlanDate = new Date(rows[i].task_plan_date).toLocaleDateString();
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
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.companyName+","+parkObj.driveName+","+parkObj.truckNum+","+
                    parkObj.eShortName+","+parkObj.routeStart+","+parkObj.addrName+","+parkObj.routeEnd+","+parkObj.rShortName+","+
                    parkObj.orderDate+","+parkObj.taskPlanDate+","+parkObj.distance+","+parkObj.fee+","+parkObj.fees+'\r\n';
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
    createSettleOuterTruck : createSettleOuterTruck,
    querySettleOuterTruck : querySettleOuterTruck,
    getSettleOuterTruckBaseCsv : getSettleOuterTruckBaseCsv,
    uploadSettleOuterTruckFile : uploadSettleOuterTruckFile,
    querySettleOuterTruckList : querySettleOuterTruckList,
    querySettleOuterCarList : querySettleOuterCarList,
    querySettleOuterTruckCarCount : querySettleOuterTruckCarCount,
    updateSettleOuterTruck : updateSettleOuterTruck,
    getSettleOuterTruckCsv : getSettleOuterTruckCsv
}
