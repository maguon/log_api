/**
 * Created by yym on 2020/12/4.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var totalMonthStatDAO = require('../dao/TotalMonthStatDAO.js');
var Seq = require('seq');
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

module.exports = {
    createTotalMonthStat : createTotalMonthStat,
    querySettleStat : querySettleStat,
    getSettleStatCsv : getSettleStatCsv
}