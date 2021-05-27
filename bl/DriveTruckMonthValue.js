/**
 * Created by zwl on 2019/5/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveTruckMonthValueDAO = require('../dao/DriveTruckMonthValueDAO.js');
var truckDAO = require('../dao/TruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveTruckMonthValue.js');
var moment = require('moment/moment.js');
var csv=require('csvtojson');
var fs = require('fs');


function createDriveTruckMonthValue(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var yMonthDay = new Date(myDate-30*24*60*60*1000);
    var yMonth = moment(yMonthDay).format('YYYYMM');
    Seq().seq(function(){
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.deleteDriveTruckMonthValue(params,function(error,result){
            if (error) {
                logger.error(' deleteDriveTruckMonthValue ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' deleteDriveTruckMonthValue ' + 'success');
                }else{
                    logger.warn(' deleteDriveTruckMonthValue ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.addDistance(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "数据已经存在");
                    return next();
                } else{
                    logger.error(' createDriveTruckMonthValue ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDriveTruckMonthValue ' + 'success');
                }else{
                    logger.warn(' createDriveTruckMonthValue ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateStorageCarCount(params,function(err,result){
            if (err) {
                logger.error(' updateStorageCarCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateStorageCarCount ' + 'success');
                }else{
                    logger.warn(' updateStorageCarCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateOutput(params,function(err,result){
            if (err) {
                logger.error(' updateOutput ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateOutput ' + 'success');
                }else{
                    logger.warn(' updateOutput ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateInsureFee(params,function(err,result){
            if (err) {
                logger.error(' updateInsureFee ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateInsureFee ' + 'success');
                }else{
                    logger.warn(' updateInsureFee ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateDistanceSalary(params,function(err,result){
            if (err) {
                logger.error(' updateDistanceSalary ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDistanceSalary ' + 'success');
                }else{
                    logger.warn(' updateDistanceSalary ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateDamage(params,function(err,result){
            if (err) {
                logger.error(' updateDamage ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamage ' + 'success');
                }else{
                    logger.warn(' updateDamage ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        params.startDate = params.yMonth.substr(0,4) + '-' + params.yMonth.substr(4,2) + '-01';
        params.lastDateTime = moment(params.yMonth+'01').endOf('month').format("YYYY-MM-DD") ;
        driveTruckMonthValueDAO.updateCleanFee(params,function(err,result){
            if (err) {
                logger.error(' updateCleanFee ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCleanFee ' + 'success');
                }else{
                    logger.warn(' updateCleanFee ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateHotelFee(params,function(err,result){
            if (err) {
                logger.error(' updateHotelFee ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateHotelFee ' + 'success');
                }else{
                    logger.warn(' updateHotelFee ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateEtcFee(params,function(err,result){
            if (err) {
                logger.error(' updateEtcFee ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateEtcFee ' + 'success');
                }else{
                    logger.warn(' updateEtcFee ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateOilFee(params,function(err,result){
            if (err) {
                logger.error(' updateOilFee ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateOilFee ' + 'success');
                }else{
                    logger.warn(' updateOilFee ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updatePeccancy(params,function(err,result){
            if (err) {
                logger.error(' updatePeccancy ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updatePeccancy ' + 'success');
                }else{
                    logger.warn(' updatePeccancy ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateRepair2(params,function(err,result){
            if (err) {
                logger.error(' updateRepair2 ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updatePeccancy2 ' + 'success');
                }else{
                    logger.warn(' updatePeccancy2 ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateRepair3(params,function(err,result){
            if (err) {
                logger.error(' updateRepair3 ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updatePeccancy3 ' + 'success');
                }else{
                    logger.warn(' updatePeccancy3 ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateCarOilFee(params,function(err,result){
            if (err) {
                logger.error(' updateCarOilFee ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCarOilFee ' + 'success');
                }else{
                    logger.warn(' updateCarOilFee ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateTruckNum(params,function(err,result){
            if (err) {
                logger.error(' updateTruckNum ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCarOilFee ' + 'success');
                }else{
                    logger.warn(' updateCarOilFee ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        params.yMonth = yMonth;
        driveTruckMonthValueDAO.updateDrive(params,function(err,result){
            if (err) {
                logger.error(' updateDrive ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDrive ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDriveTruckMonthValue(req,res,next){
    var params = req.params ;
    driveTruckMonthValueDAO.getDriveTruckMonthValue(params,function(error,result){
        if (error) {
            logger.error(' queryDriveTruckMonthValue ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveTruckMonthValue ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function uploadDepreciationFeeFile(req,res,next){
    var params = req.params;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var depreciationFlag = false;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            Seq().seq(function(){
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
                        }else{
                            parkObj.truckId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    truckId : parkObj.truckId,
                    yMonth : objArray[i].月份,
                    row : i+1,
                }
                driveTruckMonthValueDAO.getDriveTruckMonthValue(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getDriveTruckMonthValue ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            depreciationFlag = true;
                        }else{
                            depreciationFlag = false;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(depreciationFlag){
                    var subParams ={
                        depreciationFee : objArray[i].折旧费,
                        truckId : parkObj.truckId,
                        yMonth : objArray[i].月份,
                        row : i+1
                    }
                    driveTruckMonthValueDAO.updateTruckDepreciationFee(subParams,function(err,result){
                        if (err) {
                            logger.error(' uploadDepreciationFeeFile ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result && result.affectedRows > 0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' uploadDepreciationFeeFile ' + 'success');
                            }else{
                                logger.warn(' uploadDepreciationFeeFile ' + 'failed');
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
            logger.info(' uploadDepreciationFeeFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function updateTruckDepreciationFee(req,res,next){
    var params = req.params ;
    driveTruckMonthValueDAO.updateTruckDepreciationFee(params,function(error,result){
        if (error) {
            logger.error(' updateTruckDepreciationFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckDepreciationFee ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDepreciationFee(req,res,next){
    var params = req.params ;
    driveTruckMonthValueDAO.updateDepreciationFee(params,function(error,result){
        if (error) {
            logger.error(' updateDepreciationFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDepreciationFee ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeDriveTruckMonthValue(req,res,next){
    var params = req.params ;
    driveTruckMonthValueDAO.deleteDriveTruckMonthValue(params,function(error,result){
        if (error) {
            logger.error(' removeDriveTruckMonthValue ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDriveTruckMonthValue ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getDriveTruckMonthValueCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' +"司机" + ',' + "货车牌号" + ',' + "货车品牌" + ','+ "板位数" + ','+ "所属类型"+ ','+ "所属公司" + ','+ "产值公司" + ','+
        "倒板数" + ','+"倒板工资" + ','+"重载里程" + ','+ "空载里程"+ ','+ "总里程"+ ','+ "重载率"+ ','+ "重载油耗里程"+ ','+ "空载油耗里程" + ','+
        "运送经销商台数" + ','+ "运送到库台数" + ','+"产值" + ','+"二级产值" + ','+"货车保险"+ ','+ "折旧费"+ ','+ "应发里程工资"+ ','+
        "质损个人承担"+ ','+ "质损公司承担"+ ','+ "洗车费" + ','+ "出勤天数" + ','+"满勤补助" + ','+ "拼装补助" + ','+ "交车打车进门费"+ ','+
        "拖车费"+ ','+ "提车费"+ ','+ "地跑费"+ ','+ "带路费"+ ','+ "过路费" + ','+ "油量" + ','+ "油费" + ',' + "尿素量" + ','+"尿素费" + ','+
        "违章罚款个人承担"+ ','+ "违章罚款公司承担"+ ','+ "公司维修费"+ ','+ "公司配件费"+ ','+ "公司保养费"+','+ "在外维修费"+ ','+ "在外配件费"+ ','+
        "在外保养费"+ ','+ "商品车加油费" + ','+ "商品车停车费"+ ','+ "货车停车费"+','+"其他费用"+','+"经销商其他费用";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveTruckMonthValueDAO.getDriveTruckMonthValue(params,function(error,rows){
        if (error) {
            logger.error(' getDriveTruckMonthValue ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                // 月份
                parkObj.yMonth = rows[i].y_month;
                // 司机
                parkObj.driveName = rows[i].drive_name;
                // 货车牌号
                parkObj.truckNum = rows[i].truck_num;
                // 货车品牌
                parkObj.brandName = rows[i].brand_name;
                // 板位数
                parkObj.truckNumber = rows[i].truck_number;
                // 所属类型
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else{
                    parkObj.operateType = "外协";
                }
                // 所属公司
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                // 产值公司
                if(rows[i].output_company_name == null){
                    parkObj.outputCompanyName = "";
                }else{
                    parkObj.outputCompanyName = rows[i].output_company_name;
                }

                // 倒板数
                if(rows[i].reverse_count == null){
                    parkObj.reverseCount = "";
                }else{
                    parkObj.reverseCount = rows[i].reverse_count;
                }
                // 倒板工资
                if(rows[i].reverse_salary == null){
                    parkObj.reverseSalary = "";
                }else{
                    parkObj.reverseSalary = rows[i].reverse_salary;
                }
                // 重载里程
                if(rows[i].load_distance == null){
                    parkObj.loadDistance = "";
                }else{
                    parkObj.loadDistance = rows[i].load_distance;
                }
                // 空载里程
                if(rows[i].no_load_distance == null){
                    parkObj.noLoadDistance = "";
                }else{
                    parkObj.noLoadDistance = rows[i].no_load_distance;
                }
                // 总里程
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                // 重载率
                parkObj.loadRatio =rows[i].load_distance/(rows[i].load_distance+rows[i].no_load_distance);
                // 重载油耗里程
                if(rows[i].load_oil_distance == null){
                    parkObj.loadOilDistance = "";
                }else{
                    parkObj.loadOilDistance = rows[i].load_oil_distance;
                }
                // 空载油耗里程
                if(rows[i].no_oil_distance == null){
                    parkObj.noOilDistance = "";
                }else{
                    parkObj.noOilDistance = rows[i].no_oil_distance;
                }

                // 运送经销商台数
                if(rows[i].receive_car_count == null){
                    parkObj.receiveCarCount = "";
                }else{
                    parkObj.receiveCarCount = rows[i].receive_car_count;
                }
                // 运送到库台数
                if(rows[i].storage_car_count == null){
                    parkObj.storageCarCount = "";
                }else{
                    parkObj.storageCarCount = rows[i].storage_car_count;
                }
                // 产值
                if(rows[i].output == null){
                    parkObj.output = "";
                }else{
                    parkObj.output = rows[i].output;
                }
                // 二级产值
                if(rows[i].two_output == null){
                    parkObj.twoOutput = "";
                }else{
                    parkObj.twoOutput = rows[i].two_output;
                }
                // 货车保险
                if(rows[i].insure_fee == null){
                    parkObj.insureFee = "";
                }else{
                    parkObj.insureFee = rows[i].insure_fee;
                }
                // 折旧费
                if(rows[i].depreciation_fee == null){
                    parkObj.depreciationFee = "";
                }else{
                    parkObj.depreciationFee = rows[i].depreciation_fee;
                }
                // 应发里程工资
                if(rows[i].distance_salary == null){
                    parkObj.distanceSalary = "";
                }else{
                    parkObj.distanceSalary = rows[i].distance_salary;
                }

                // 质损个人承担
                if(rows[i].damage_under_fee == null){
                    parkObj.damageUnderFee = "";
                }else{
                    parkObj.damageUnderFee = rows[i].damage_under_fee;
                }
                // 质损公司承担
                if(rows[i].damage_company_fee == null){
                    parkObj.damageCompanyFee = "";
                }else{
                    parkObj.damageCompanyFee = rows[i].damage_company_fee;
                }
                // 洗车费
                if(rows[i].clean_fee == null){
                    parkObj.cleanFee = "";
                }else{
                    parkObj.cleanFee = rows[i].clean_fee;
                }
                // 出勤天数
                if(rows[i].work_count == null){
                    parkObj.workCount = "";
                }else{
                    parkObj.workCount = rows[i].work_count;
                }
                // 满勤补助
                if(rows[i].full_work_bonus == null){
                    parkObj.fullWorkBonus = "";
                }else{
                    parkObj.fullWorkBonus = rows[i].full_work_bonus;
                }
                // 拼装补助
                if(rows[i].transfer_bonus == null){
                    parkObj.transferBonus = "";
                }else{
                    parkObj.transferBonus = rows[i].transfer_bonus;
                }
                // 交车打车进门费
                if(rows[i].enter_fee == null){
                    parkObj.enterFee = "";
                }else{
                    parkObj.enterFee = rows[i].enter_fee;
                }

                if(rows[i].trailer_fee == null){
                    parkObj.trailerFee = "";
                }else{
                    parkObj.trailerFee = rows[i].trailer_fee;
                }
                if(rows[i].car_parking_fee == null){
                    parkObj.carParkingFee = "";
                }else{
                    parkObj.carParkingFee = rows[i].car_parking_fee;
                }
                if(rows[i].run_fee == null){
                    parkObj.runFee = "";
                }else{
                    parkObj.runFee = rows[i].run_fee;
                }
                if(rows[i].lead_fee == null){
                    parkObj.leadFee = "";
                }else{
                    parkObj.leadFee = rows[i].lead_fee;
                }
                if(rows[i].etc_fee == null){
                    parkObj.etcFee = "";
                }else{
                    parkObj.etcFee = rows[i].etc_fee;
                }
                //油量
                if(rows[i].oil_vol == null){
                    parkObj.oilVol = "";
                }else{
                    parkObj.oilVol = rows[i].oil_vol;
                }
                //油费
                if(rows[i].oil_fee == null){
                    parkObj.oilFee = "";
                }else{
                    parkObj.oilFee = rows[i].oil_fee;
                }
                //尿素量
                if(rows[i].urea_vol == null){
                    parkObj.ureaVol = "";
                }else{
                    parkObj.ureaVol = rows[i].urea_vol;
                }
                //尿素费
                if(rows[i].urea_fee == null){
                    parkObj.ureaFee = "";
                }else{
                    parkObj.ureaFee = rows[i].urea_fee;
                }
                if(rows[i].peccancy_under_fee == null){
                    parkObj.peccancyUnderFee = "";
                }else{
                    parkObj.peccancyUnderFee = rows[i].peccancy_under_fee;
                }
                if(rows[i].peccancy_company_fee == null){
                    parkObj.peccancyCompanyFee = "";
                }else{
                    parkObj.peccancyCompanyFee = rows[i].peccancy_company_fee;
                }
                //公司维修费
                if(rows[i].repair_fee_2 == null){
                    parkObj.repairFee2 = "";
                }else{
                    parkObj.repairFee2 = rows[i].repair_fee_2;
                }
                //公司配件费
                if(rows[i].parts_fee_2 == null){
                    parkObj.partsFee2 = "";
                }else{
                    parkObj.partsFee2 = rows[i].parts_fee_2;
                }
                //公司保养费
                if(rows[i].maintain_fee_2 == null){
                    parkObj.maintainFee2 = "";
                }else{
                    parkObj.maintainFee2 = rows[i].maintain_fee_2;
                }
                //在外维修费
                if(rows[i].repair_fee_3 == null){
                    parkObj.repairFee3 = "";
                }else{
                    parkObj.repairFee3 = rows[i].repair_fee_3;
                }
                //在外配件费
                if(rows[i].parts_fee_3 == null){
                    parkObj.partsFee3 = "";
                }else{
                    parkObj.partsFee3 = rows[i].parts_fee_3;
                }
                //在外保养费
                if(rows[i].maintain_fee_3 == null){
                    parkObj.maintainFee3 = "";
                }else{
                    parkObj.maintainFee3 = rows[i].maintain_fee_3;
                }


                if(rows[i].car_oil_fee == null){
                    parkObj.carOilFee = "";
                }else{
                    parkObj.carOilFee = rows[i].car_oil_fee;
                }
                if(rows[i].car_parking_total_fee == null){
                    parkObj.carParkingTotalFee = "";
                }else{
                    parkObj.carParkingTotalFee = rows[i].car_parking_total_fee;
                }
                if(rows[i].truck_parking_fee == null){
                    parkObj.truckParkingFee = "";
                }else{
                    parkObj.truckParkingFee = rows[i].truck_parking_fee;
                }
                if(rows[i].other_fee == null){
                    parkObj.otherFee = "";
                }else{
                    parkObj.otherFee = rows[i].other_fee;
                }
                //其他洗车费(经销商其他费用)
                if(rows[i].other_clean_fee == null){
                    parkObj.otherCleanFee = "";
                }else{
                    parkObj.otherCleanFee = rows[i].other_clean_fee;
                }
                csvString = csvString+parkObj.yMonth+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.brandName+","+parkObj.truckNumber+","+
                    parkObj.operateType+","+parkObj.companyName+","+parkObj.outputCompanyName+","+parkObj.reverseCount+","+parkObj.reverseSalary+","+
                    parkObj.loadDistance+","+parkObj.noLoadDistance+","+parkObj.distance+","+parkObj.loadRatio.toFixed(2)+","+parkObj.loadOilDistance+","+
                    parkObj.noOilDistance+","+ parkObj.receiveCarCount+","+parkObj.storageCarCount+","+parkObj.output+","+parkObj.twoOutput+","+
                    parkObj.insureFee+","+parkObj.depreciationFee+","+
                    parkObj.distanceSalary+","+parkObj.damageUnderFee+","+parkObj.damageCompanyFee+","+parkObj.cleanFee+","+parkObj.workCount+","+
                    parkObj.fullWorkBonus+","+ parkObj.transferBonus +","+parkObj.enterFee+","+parkObj.trailerFee+","+parkObj.carParkingFee+","+parkObj.runFee+","+
                    parkObj.leadFee+","+parkObj.etcFee+","+parkObj.oilVol+","+ parkObj.oilFee+","+parkObj.ureaVol+"," +parkObj.ureaFee+","+parkObj.peccancyUnderFee+","+
                    parkObj.peccancyCompanyFee+","+parkObj.repairFee2+","+parkObj.partsFee2+","+parkObj.maintainFee2+","+
                    parkObj.repairFee3+","+parkObj.partsFee3+","+parkObj.maintainFee3+ ","+parkObj.carOilFee+","+
                    parkObj.carParkingTotalFee+","+parkObj.truckParkingFee+","+parkObj.otherFee+","+parkObj.otherCleanFee+ '\r\n';
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
    createDriveTruckMonthValue : createDriveTruckMonthValue,
    queryDriveTruckMonthValue : queryDriveTruckMonthValue,
    uploadDepreciationFeeFile : uploadDepreciationFeeFile,
    updateTruckDepreciationFee : updateTruckDepreciationFee,
    updateDepreciationFee : updateDepreciationFee,
    removeDriveTruckMonthValue : removeDriveTruckMonthValue,
    getDriveTruckMonthValueCsv : getDriveTruckMonthValueCsv
}