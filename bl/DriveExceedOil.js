/**
 * Created by zwl on 2018/6/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilDAO = require('../dao/DriveExceedOilDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DriveExceedOil.js');

function createDriveExceedOil(req,res,next){
    var params = req.params ;
    var dateId = params.oilDate;
    var strDate = moment(dateId).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    driveExceedOilDAO.addDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' createDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveExceedOil ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOil(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOil ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilCount(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveExceedOilCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOil(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.updateDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOil ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveOilStatus(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.updateDriveOilStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDriveOilStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveOilStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveOilMonthStat(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveOilMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveOilMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveOilMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveUreaMonthStat(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveUreaMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveUreaMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveUreaMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveOilMoneyMonthStat(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveOilMoneyMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveOilMoneyMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveOilMoneyMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveOilWeekStat(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveOilWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveOilWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveOilWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveUreaWeekStat(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveUreaWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveUreaWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveUreaWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveOilMoneyWeekStat(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveOilMoneyWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDriveOilMoneyWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveOilMoneyWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDriveExceedOilCsv(req,res,next){
    var csvString = "";
    var header = "超量结算编号" + ',' + "司机" + ',' + "核油日期" + ','+ "计划用油量" + ','+ "计划尿素量"+','+ "实际用油量"
        + ','+ "实际尿素量" + ','+ "超油量" + ','+ "超尿素量" + ','+ "实际超量金额" + ','+ "状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveExceedOilDAO.getDriveExceedOil(params,function(error,rows){
        if (error) {
            logger.error(' getDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].oil_date == null){
                    parkObj.oilDate = "";
                }else{
                    parkObj.oilDate = new Date(rows[i].oil_date).toLocaleDateString();
                }
                if(rows[i].plan_oil == null){
                    parkObj.planOil = "";
                }else{
                    parkObj.planOil = rows[i].plan_oil;
                }
                if(rows[i].plan_urea == null){
                    parkObj.planUrea = "";
                }else{
                    parkObj.planUrea = rows[i].plan_urea;
                }
                if(rows[i].actual_oil == null){
                    parkObj.actualOil = "";
                }else{
                    parkObj.actualOil = rows[i].actual_oil;
                }
                if(rows[i].actual_urea == null){
                    parkObj.actualUrea = "";
                }else{
                    parkObj.actualUrea = rows[i].actual_urea;
                }
                if(rows[i].exceed_oil == null){
                    parkObj.exceedOil = "";
                }else{
                    parkObj.exceedOil = rows[i].exceed_oil;
                }
                if(rows[i].exceed_urea == null){
                    parkObj.exceedUrea = "";
                }else{
                    parkObj.exceedUrea = rows[i].exceed_urea;
                }
                if(rows[i].actual_money == null){
                    parkObj.actualMoney = "";
                }else{
                    parkObj.actualMoney = rows[i].actual_money;
                }
                if(rows[i].stat_status == 1){
                    parkObj.statStatus = "未扣";
                }else{
                    parkObj.statStatus = "已扣";
                }
                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.oilDate+","+parkObj.planOil+","+parkObj.planUrea
                    +","+parkObj.actualOil+","+parkObj.actualUrea+","+parkObj.exceedOil+","+parkObj.exceedUrea +","+parkObj.actualMoney+","+parkObj.statStatus+ '\r\n';
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
    createDriveExceedOil : createDriveExceedOil,
    queryDriveExceedOil : queryDriveExceedOil,
    queryDriveExceedOilCount : queryDriveExceedOilCount,
    updateDriveExceedOil : updateDriveExceedOil,
    updateDriveOilStatus : updateDriveOilStatus,
    queryDriveOilMonthStat : queryDriveOilMonthStat,
    queryDriveUreaMonthStat : queryDriveUreaMonthStat,
    queryDriveOilMoneyMonthStat : queryDriveOilMoneyMonthStat,
    queryDriveOilWeekStat : queryDriveOilWeekStat,
    queryDriveUreaWeekStat : queryDriveUreaWeekStat,
    queryDriveOilMoneyWeekStat : queryDriveOilMoneyWeekStat,
    getDriveExceedOilCsv : getDriveExceedOilCsv
}
