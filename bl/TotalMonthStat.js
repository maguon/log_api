/**
 * Created by yym on 2020/12/4.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var totalMonthStatDAO = require('../dao/TotalMonthStatDAO.js');
var Seq = require('seq');
var moment = require('moment/moment.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TotalMonthStatDAO.js');


function createTotalMonthStat(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        totalMonthStatDAO.deleteTotalMonthStat(params,function(error,result){
            if (error) {
                logger.error(' deleteTotalMonthStat ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' deleteTotalMonthStat ' + 'success');
                }else{
                    logger.warn(' deleteTotalMonthStat ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        totalMonthStatDAO.addTotalMonthStat(params,function(error,result){
            if (error) {
                if(error.message.indexOf("Duplicate") > 0) {
                    resUtil.resetFailedRes(res, "数据已经存在");
                    return next();
                } else{
                    logger.error(' addTotalMonthStat ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
            } else {
                if(result&&result.insertId>0){
                    logger.info(' addTotalMonthStat ' + 'success');
                }else{
                    logger.warn(' addTotalMonthStat ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //商品车数量
        totalMonthStatDAO.updateCarCount(params,function(err,result){
            if (err) {
                logger.error(' updateCarCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCarCount ' + 'success');
                }else{
                    logger.warn(' updateCarCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //产值
        totalMonthStatDAO.updateOutputCount(params,function(err,result){
            if (err) {
                logger.error(' updateOutputCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateOutputCount ' + 'success');
                }else{
                    logger.warn(' updateOutputCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //运营货车数量 , 重载公里数 , 空载公里数 , 总公里数 , 重载率
        totalMonthStatDAO.updateTruckCount(params,function(err,result){
            if (err) {
                logger.error(' updateTruckCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckCount ' + 'success');
                }else{
                    logger.warn(' updateTruckCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //运营货车数量  truck_count 根据位数统计
        totalMonthStatDAO.updateTruckCountConcat(params,function(err,result){
            if (err) {
                logger.error(' updateTruckCountConcat ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateTruckCountConcat ' + 'success');
                }else{
                    logger.warn(' updateTruckCountConcat ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        /*外协商品车数量1 , 外协费用1 结算直接查询*/
        totalMonthStatDAO.updateOuterCarCount(params,function(err,result){
            if (err) {
                logger.error(' updateOuterCarCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateOuterCarCount ' + 'success');
                }else{
                    logger.warn(' updateOuterCarCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        /*外协商品车数量2 , 外协费用2 路线查询费用*/
        totalMonthStatDAO.updateOuterRouteCarCount(params,function(err,result){
            if (err) {
                logger.error(' updateOuterRouteCarCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateOuterRouteCarCount ' + 'success');
                }else{
                    logger.warn(' updateOuterRouteCarCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        /*外协产值1 结算直接查询*/
        totalMonthStatDAO.updateOuterOutput(params,function(err,result){
            if (err) {
                logger.error(' updateOuterOutput ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateOuterOutput ' + 'success');
                }else{
                    logger.warn(' updateOuterOutput ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        /*外协产值2 路线查询费用*/
        totalMonthStatDAO.updateOuterRouteOutput(params,function(err,result){
            if (err) {
                logger.error(' updateOuterRouteOutput ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateOuterRouteOutput ' + 'success');
                }else{
                    logger.warn(' updateOuterRouteOutput ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //过路费
        totalMonthStatDAO.updateEtcFeeCount(params,function(err,result){
            if (err) {
                logger.error(' updateEtcFeeCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateEtcFeeCount ' + 'success');
                }else{
                    logger.warn(' updateEtcFeeCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //加油量 , 加油费 , 尿素量 , 尿素费
        totalMonthStatDAO.updateOilCount(params,function(err,result){
            if (err) {
                logger.error(' updateOilCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateOilCount ' + 'success');
                }else{
                    logger.warn(' updateOilCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //修车费 , 零件费 , 保养费
        //内部维修数 , 内部维修费 , 在外维修次数 , 在外维修数
        totalMonthStatDAO.updateRepairCount(params,function(err,result){
            if (err) {
                logger.error(' updateRepairCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateRepairCount ' + 'success');
                }else{
                    logger.warn(' updateRepairCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //处罚次数 , 处罚分数 , 买分金额 , 交通罚款 ,
        //处理金额 , 司机承担罚款 , 公司承担
        totalMonthStatDAO.updatePeccancyCount(params,function(err,result){
            if (err) {
                logger.error(' updatePeccancyCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updatePeccancyCount ' + 'success');
                }else{
                    logger.warn(' updatePeccancyCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //质损数 , 个人承担质损费 , 公司承担质损费 , 质损总成本
        totalMonthStatDAO.updateDamageCount(params,function(err,result){
            if (err) {
                logger.error(' updateDamageCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageCount ' + 'success');
                }else{
                    logger.warn(' updateDamageCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //洗车费
        params.startDate = params.yMonth.substr(0,4) + '-' + params.yMonth.substr(4,2) + '-01';
        params.lastDateTime = moment(params.yMonth+'01').endOf('month').format("YYYY-MM-DD") ;
        totalMonthStatDAO.updateCleanFeeCount(params,function(err,result){
            if (err) {
                logger.error(' updateCleanFeeCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateCleanFeeCount ' + 'success');
                }else{
                    logger.warn(' updateCleanFeeCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //进门费 , 拖车费 , 商品车停车费 , 地跑费 , 带路费
        totalMonthStatDAO.updateDriveTruckFeeCount(params,function(err,result){
            if (err) {
                logger.error(' updateDriveTruckFeeCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDriveTruckFeeCount ' + 'success');
                }else{
                    logger.warn(' updateDriveTruckFeeCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //单车产值 , 单公里产值
        totalMonthStatDAO.updatePerOutputCount(params,function(err,result){
            if (err) {
                logger.error(' updatePerOutputCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updatePerOutputCount ' + 'success');
                }else{
                    logger.warn(' updatePerOutputCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //单车质损成本 , 单车公司承担成本
        totalMonthStatDAO.updatePerCarDamageMoneyCount(params,function(err,result){
            if (err) {
                logger.error(' updatePerCarDamageMoneyCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updatePerCarDamageMoneyCount ' + 'success');
                }else{
                    logger.warn(' updatePerCarDamageMoneyCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        var that = this;
        //质损率
        totalMonthStatDAO.updateDamageRatioCount(params,function(err,result){
            if (err) {
                logger.error(' updateDamageRatioCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageRatioCount ' + 'success');
                }else{
                    logger.warn(' updateDamageRatioCount ' + 'failed');
                }
                that();
            }
        })
    }).seq(function () {
        //单车洗车费
        totalMonthStatDAO.updatePerCarCleanFeeCount(params,function(err,result){
            if (err) {
                logger.error(' updatePerCarCleanFeeCount ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updatePerCarCleanFeeCount ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

//结算部门统计
function querySettleStat(req,res,next){
    var params = req.params ;
    totalMonthStatDAO.getSettleStat(params,function(error,result){
        if (error) {
            logger.error(' querySettleStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getSettleStatCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' +"产值" + ','+"外协产值" + ','+"单车产值"+ ','+ "单车公里产值";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    totalMonthStatDAO.getSettleStat(params,function(error,rows){
        if (error) {
            logger.error(' getDriveTruckMonthValue ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                // 月份
                parkObj.yMonth = rows[i].y_month;

                // 产值
                if(rows[i].output == null){
                    parkObj.output = "";
                }else{
                    parkObj.output = rows[i].output;
                }

                // 外协产值
                if(rows[i].outer_output   == null){
                    parkObj.outer_output   = "";
                }else{
                    parkObj.outer_output   = rows[i].outer_output  ;
                }

                // 单车产值
                if(rows[i].per_truck_output  == null){
                    parkObj.per_truck_output  = "";
                }else{
                    parkObj.per_truck_output  = rows[i].per_truck_output ;
                }

                // 单车公里产值
                if(rows[i].per_km_output == null){
                    parkObj.per_km_output = "";
                }else{
                    parkObj.per_km_output = rows[i].per_km_output;
                }

                csvString = csvString+parkObj.yMonth+","+parkObj.output+","+parkObj.outer_output+","+parkObj.per_truck_output+","+parkObj.per_km_output+ '\r\n';
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

//调度统计
function queryDispatchStat(req,res,next){
    var params = req.params ;
    totalMonthStatDAO.getDispatchStat(params,function(error,result){
        if (error) {
            logger.error(' queryDispatchStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDispatchStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDispatchStatCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' +"出车数" + ','+"发运量" + ','+"总里程"+ ','+ "重载历程" + ',' + "重载率";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    totalMonthStatDAO.getDispatchStat(params,function(error,rows){
        if (error) {
            logger.error(' getDispatchStatCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                // 月份
                parkObj.yMonth = rows[i].y_month;

                // 出车数
                if(rows[i].truck_count  == null){
                    parkObj.truck_count  = "";
                }else{
                    parkObj.truck_count  = rows[i].truck_count ;
                }

                // 发运量
                if(rows[i].car_count    == null){
                    parkObj.car_count    = "";
                }else{
                    parkObj.car_count    = rows[i].car_count   ;
                }

                // 总里程
                if(rows[i].total_distance   == null){
                    parkObj.total_distance   = "";
                }else{
                    parkObj.total_distance   = rows[i].total_distance  ;
                }

                // 重载历程
                if(rows[i].load_distance  == null){
                    parkObj.load_distance  = "";
                }else{
                    parkObj.load_distance  = rows[i].load_distance ;
                }

                // 重载率
                if(rows[i].load_ratio  == null){
                    parkObj.load_ratio  = "";
                }else{
                    parkObj.load_ratio  = rows[i].load_ratio ;
                }

                csvString = csvString+parkObj.yMonth+","+parkObj.truck_count+","+parkObj.car_count+","+parkObj.total_distance+","+
                    parkObj.load_distance+ ","+parkObj.load_ratio+ '\r\n';
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

//质量统计
function queryQualityStat(req,res,next){
    var params = req.params ;
    totalMonthStatDAO.getQualityStat(params,function(error,result){
        if (error) {
            logger.error(' queryQualityStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryQualityStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getQualityStatCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' +"质损次数" + ','+"总体质损成本" + ','+"公司承担质损成本"+ ','+
        "单车质损成本" + ',' + "单车公司质损成本 " + ',' + "洗车费 "+ ',' +
        "单车洗车费 "+ ',' + "质损率 ";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    totalMonthStatDAO.getQualityStat(params,function(error,rows){
        if (error) {
            logger.error(' getQualityStatCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                // 月份
                parkObj.yMonth = rows[i].y_month;

                // 质损次数
                if(rows[i].damage_count  == null){
                    parkObj.damage_count  = "";
                }else{
                    parkObj.damage_count  = rows[i].damage_count ;
                }

                // 总体质损成本
                if(rows[i].total_damange_money    == null){
                    parkObj.total_damange_money    = "";
                }else{
                    parkObj.total_damange_money    = rows[i].total_damange_money   ;
                }

                // 公司承担质损成本
                if(rows[i].company_damage_money   == null){
                    parkObj.company_damage_money   = "";
                }else{
                    parkObj.company_damage_money   = rows[i].company_damage_money  ;
                }

                // 单车质损成本
                if(rows[i].per_car_damage_money  == null){
                    parkObj.per_car_damage_money  = "";
                }else{
                    parkObj.per_car_damage_money  = rows[i].per_car_damage_money ;
                }

                // 单车公司质损成本
                if(rows[i].per_car_c_damange_money    == null){
                    parkObj.per_car_c_damange_money    = "";
                }else{
                    parkObj.per_car_c_damange_money    = rows[i].per_car_c_damange_money   ;
                }

                // 洗车费
                if(rows[i].clean_fee   == null){
                    parkObj.clean_fee   = "";
                }else{
                    parkObj.clean_fee   = rows[i].clean_fee  ;
                }

                // 单车洗车费
                if(rows[i].per_car_clean_fee  == null){
                    parkObj.per_car_clean_fee  = "";
                }else{
                    parkObj.per_car_clean_fee  = rows[i].per_car_clean_fee ;
                }

                // 质损率
                if(rows[i].damage_ratio  == null){
                    parkObj.damage_ratio  = "";
                }else{
                    parkObj.damage_ratio  = rows[i].damage_ratio ;
                }

                csvString = csvString+parkObj.yMonth+","+parkObj.damage_count+","+parkObj.total_damange_money +
                    ","+parkObj.company_damage_money+ ","+ parkObj.per_car_damage_money+ ","+parkObj.per_car_c_damange_money +
                    ","+parkObj.clean_fee+ ","+ parkObj.per_car_clean_fee+ ","+parkObj.damage_ratio+ '\r\n';
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

//车管统计
function queryTruckStat(req,res,next){
    var params = req.params ;
    totalMonthStatDAO.getTruckStat(params,function(error,result){
        if (error) {
            logger.error(' queryTruckStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getTruckStatCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' +"过路费" + ','+"油量" + ','+"油费"+ ','+
        "尿素量" + ',' + "尿素费  " + ',' + "修理费 "+ ',' +
        "配件费" + ',' + "保养费  " + ',' + "在外维修次数 "+ ',' +
        "在外维修金额" + ',' + "买分金额  " + ',' + "交通罚款 "+ ',' +
        "个人承担违章" + ',' + "公司承担违章  " ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    totalMonthStatDAO.getTruckStat(params,function(error,rows){
        if (error) {
            logger.error(' getTruckStatCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                // 月份
                parkObj.yMonth = rows[i].y_month;

                // 过路费
                if(rows[i].etc_fee  == null){
                    parkObj.etc_fee  = "";
                }else{
                    parkObj.etc_fee  = rows[i].etc_fee ;
                }

                // 油量
                if(rows[i].oil_vol  == null){
                    parkObj.oil_vol  = "";
                }else{
                    parkObj.oil_vol  = rows[i].oil_vol   ;
                }

                // 油费
                if(rows[i].oil_fee  == null){
                    parkObj.oil_fee  = "";
                }else{
                    parkObj.oil_fee  = rows[i].oil_fee  ;
                }

                // 尿素量
                if(rows[i].urea_vol  == null){
                    parkObj.urea_vol  = "";
                }else{
                    parkObj.urea_vol  = rows[i].urea_vol ;
                }

                // 尿素费
                if(rows[i].urea_fee  == null){
                    parkObj.urea_fee  = "";
                }else{
                    parkObj.urea_fee  = rows[i].urea_fee   ;
                }

                // 修理费
                if(rows[i].repair_fee  == null){
                    parkObj.repair_fee  = "";
                }else{
                    parkObj.repair_fee  = rows[i].repair_fee  ;
                }

                // 配件费
                if(rows[i].part_fee  == null){
                    parkObj.part_fee  = "";
                }else{
                    parkObj.part_fee  = rows[i].part_fee ;
                }

                // 保养费
                if(rows[i].maintain_fee  == null){
                    parkObj.maintain_fee  = "";
                }else{
                    parkObj.maintain_fee  = rows[i].maintain_fee ;
                }

                // 在外维修次数
                if(rows[i].outer_repair_count  == null){
                    parkObj.outer_repair_count  = "";
                }else{
                    parkObj.outer_repair_count  = rows[i].outer_repair_count ;
                }

                // 在外维修金额
                if(rows[i].outer_repair_fee  == null){
                    parkObj.outer_repair_fee  = "";
                }else{
                    parkObj.outer_repair_fee  = rows[i].outer_repair_fee ;
                }

                // 买分金额
                if(rows[i].buy_score_fee  == null){
                    parkObj.buy_score_fee  = "";
                }else{
                    parkObj.buy_score_fee  = rows[i].buy_score_fee ;
                }

                // 交通罚款
                if(rows[i].traffic_fine_fee  == null){
                    parkObj.traffic_fine_fee  = "";
                }else{
                    parkObj.traffic_fine_fee  = rows[i].traffic_fine_fee ;
                }

                //  个人承担违章
                if(rows[i].driver_under_money  == null){
                    parkObj.driver_under_money  = "";
                }else{
                    parkObj.driver_under_money  = rows[i].driver_under_money ;
                }

                //  公司承担违章
                if(rows[i].company_under_money  == null){
                    parkObj.company_under_money  = "";
                }else{
                    parkObj.company_under_money  = rows[i].company_under_money ;
                }

                csvString = csvString+parkObj.yMonth+","+parkObj.etc_fee+","+parkObj.oil_vol +
                    ","+parkObj.oil_fee+ ","+ parkObj.urea_vol+ ","+parkObj.urea_fee +
                    ","+parkObj.repair_fee+ ","+ parkObj.part_fee+ ","+parkObj.maintain_fee +
                    ","+parkObj.outer_repair_count+ ","+ parkObj.outer_repair_fee+ ","+parkObj.buy_score_fee +
                    ","+parkObj.traffic_fine_fee+ ","+ parkObj.driver_under_money+ ","+parkObj.company_under_money+ '\r\n';
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
    createTotalMonthStat : createTotalMonthStat,
    querySettleStat : querySettleStat,
    getSettleStatCsv : getSettleStatCsv,
    queryDispatchStat : queryDispatchStat,
    getDispatchStatCsv : getDispatchStatCsv,
    queryQualityStat : queryQualityStat,
    getQualityStatCsv : getQualityStatCsv,
    queryTruckStat : queryTruckStat,
    getTruckStatCsv : getTruckStatCsv
}