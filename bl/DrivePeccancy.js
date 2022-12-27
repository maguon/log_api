/**
 * Created by zwl on 2018/6/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var drivePeccancyDAO = require('../dao/DrivePeccancyDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var cityDAO = require('../dao/CityDAO.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DrivePeccancy.js');
var csv=require('csvtojson');
var fs = require('fs');

function createDrivePeccancy(req,res,next){
    var params = req.params ;
    var strDate = moment(params.startDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    if(params.outId == null || params.outId == "" ){
        params.outId = null;
    }
    drivePeccancyDAO.addDrivePeccancy(params,function(error,result){
        if (error) {
            logger.error(' createDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDrivePeccancy ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDrivePeccancy(req,res,next){
    var params = req.params ;
    drivePeccancyDAO.getDrivePeccancy(params,function(error,result){
        if (error) {
            logger.error(' queryDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrivePeccancy ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDrivePeccancyCount(req,res,next){
    var params = req.params ;
    drivePeccancyDAO.getDrivePeccancyCount(params,function(error,result){
        if (error) {
            logger.error(' queryDrivePeccancyCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrivePeccancyCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDrivePeccancy(req,res,next){
    var params = req.params ;
    if(params.outId == null || params.outId == "" ){
        params.outId = null;
    }
    drivePeccancyDAO.updateDrivePeccancy(params,function(error,result){
        if (error) {
            logger.error(' updateDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDrivePeccancy ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function uploadDrivePeccancyFile(req,res,next){
    var params = req.params;
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
                    driveName : objArray[i].司机,
                    row : i+1,
                }
                driveDAO.getDrive(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getDrive ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length>0) {
                            parkObj.driveId = rows[0].id;
                        }else{
                            parkObj.driveId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    truckNum : objArray[i].货车牌号,
                    row : i+1,
                }
                truckDAO.getTruckBase(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getTruckBase ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.truckId = rows[0].id;
                            parkObj.truckType = rows[0].truck_type;
                        }else{
                            parkObj.truckId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    cityId : objArray[i].城市ID,
                    row : i+1,
                }
                cityDAO.getCity(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getCity ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.cityId = rows[0].id;
                            parkObj.cityName = rows[0].city_name;
                        }else{
                            parkObj.cityId = 0;
                            parkObj.cityName = "";
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(parkObj.driveId>0&&parkObj.truckId>0){
                    var subParams ={
                        driveId : parkObj.driveId,
                        truckId : parkObj.truckId,
                        truckType : parkObj.truckType,
                        fineScore : objArray[i].扣分,
                        buyScore : objArray[i].买分金额,
                        trafficFine : objArray[i].交通罚款,
                        fineMoney : objArray[i].处理金额,
                        underMoney : objArray[i].个人承担金额,
                        companyMoney : objArray[i].公司承担金额,
                        startDate : objArray[i].违章时间,
                        handleDate : objArray[i].处理时间,
                        cityId : parkObj.cityId,
                        cityName : parkObj.cityName,
                        address : objArray[i].违章地点,
                        userId : params.userId,
                        dateId : parseInt(moment(objArray[i].违章时间).format('YYYYMMDD')),
                        outId : objArray[i].编号,
                        remark : objArray[i].备注,
                        row : i+1
                    }
                    drivePeccancyDAO.addDrivePeccancy(subParams,function(err,result){
                        if (err) {
                            logger.error(' createUploadDrivePeccancy ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result&&result.insertId>0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' createUploadDrivePeccancy ' + 'success');
                            }else{
                                logger.warn(' createUploadDrivePeccancy ' + 'failed');
                            }
                            that(null,i);
                        }
                    })
                }else{
                    that(null,i);
                }

            })

        }).seq(function(){
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadDrivePeccancyFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function getDrivePeccancyCsv(req,res,next){
    var csvString = "";
    var header = "违章结算编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "货车类型" + ','+ "扣罚分数" + ','+ "买分金额" + ','+ "交通罚款" + ','+
        "罚款金额" + ','+ "个人承担金额" + ','+ "公司承担金额"+ ','+ "违章时间" + ','+ "处理时间"+ ','+ "违章城市"+ ','+ "违章地点" + ','+
        "操作人" + ','+ "编号" + ','+ "备注" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    drivePeccancyDAO.getDrivePeccancy(params,function(error,rows){
        if (error) {
            logger.error(' getDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].truck_type == 1){
                    parkObj.truckType = "头车";
                }else{
                    parkObj.truckType = "挂车";
                }
                parkObj.fineScore = rows[i].fine_score;
                if(rows[i].buy_score == null){
                    parkObj.buyScore = "";
                }else{
                    parkObj.buyScore = rows[i].buy_score;
                }
                parkObj.trafficFine = rows[i].traffic_fine;
                parkObj.fineMoney = rows[i].fine_money;
                if(rows[i].under_money == null){
                    parkObj.underMoney = "";
                }else{
                    parkObj.underMoney = rows[i].under_money;
                }
                if(rows[i].company_money == null){
                    parkObj.companyMoney = "";
                }else{
                    parkObj.companyMoney = rows[i].company_money;
                }
                if(rows[i].start_date == null){
                    parkObj.startDate = "";
                }else{
                    parkObj.startDate = moment(rows[i].start_date).format('YYYY-MM-DD');
                }
                if(rows[i].handle_date == null){
                    parkObj.handleDate = "";
                }else{
                    parkObj.handleDate = moment(rows[i].handle_date).format('YYYY-MM-DD');
                }
                if(rows[i].city_name == null){
                    parkObj.cityName = "";
                }else{
                    parkObj.cityName = rows[i].city_name;
                }
                if(rows[i].address == null){
                    parkObj.address = "";
                }else{
                    parkObj.address = rows[i].address;
                }
                if(rows[i].op_user_name==null){
                    parkObj.opUserName = "";
                }else{
                    parkObj.opUserName = rows[i].op_user_name;
                }
                if(rows[i].out_id==null){
                    parkObj.outId = "";
                }else{
                    parkObj.outId = rows[i].out_id;
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark.replace(/[\r\n]/g, '');
                }

                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.truckType+","+parkObj.fineScore+","+
                    parkObj.buyScore+","+parkObj.trafficFine+","+parkObj.fineMoney +","+parkObj.underMoney +","+parkObj.companyMoney+","+
                    parkObj.startDate +","+parkObj.handleDate+","+ parkObj.cityName+","+parkObj.address+","+parkObj.opUserName +","+
                    parkObj.outId + "," +parkObj.remark+ '\r\n';
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
    createDrivePeccancy : createDrivePeccancy,
    queryDrivePeccancy : queryDrivePeccancy,
    queryDrivePeccancyCount : queryDrivePeccancyCount,
    updateDrivePeccancy : updateDrivePeccancy,
    uploadDrivePeccancyFile : uploadDrivePeccancyFile,
    getDrivePeccancyCsv : getDrivePeccancyCsv
}
