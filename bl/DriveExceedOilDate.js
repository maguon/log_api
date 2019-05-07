/**
 * Created by zwl on 2019/5/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilDateDAO = require('../dao/DriveExceedOilDateDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDate.js');

function createDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.addDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' createDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveExceedOilDate ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.getDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilMonth(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.getDriveExceedOilMonth(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilMonth ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.updateDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOilDate ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getDriveExceedOilMonthCsv(req,res,next){
    var csvString = "";
    var header = "月结编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "所属公司" + ','+"月份" + ','+ "计划用油量" + ','+
        "计划尿素量"+','+ "实际用油量" + ','+ "实际尿素量" + ','+ "超油量" + ','+ "超尿素量" + ','+ "超量金额" + ','+
        "扣款状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveExceedOilDateDAO.getDriveExceedOilMonth(params,function(error,rows){
        if (error) {
            logger.error(' getDriveExceedOilMonth ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                if(rows[i].id == null){
                    parkObj.id = "";
                }else{
                    parkObj.id = rows[i].id;
                }
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].truck_num == null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                if(rows[i].y_month == null){
                    parkObj.yMonth = "";
                }else{
                    parkObj.yMonth = rows[i].y_month;
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
                parkObj.exceedOil = rows[i].actual_oil - rows[i].plan_oil;
                parkObj.exceedUrea = rows[i].actual_urea - rows[i].plan_urea;
                if(rows[i].actual_money == null){
                    parkObj.actualMoney = "";
                }else{
                    parkObj.actualMoney = rows[i].actual_money;
                }
                if(rows[i].settle_status == 2){
                    parkObj.settleStatus = "已扣";
                }else{
                    parkObj.settleStatus = "未扣";
                }
                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.companyName+","+
                    parkObj.yMonth+","+ parkObj.planOil+","+parkObj.planUrea +","+parkObj.actualOil+","+parkObj.actualUrea+","+
                    parkObj.exceedOil+","+parkObj.exceedUrea +","+parkObj.actualMoney+","+parkObj.settleStatus+ '\r\n';
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
    createDriveExceedOilDate : createDriveExceedOilDate,
    queryDriveExceedOilDate : queryDriveExceedOilDate,
    queryDriveExceedOilMonth : queryDriveExceedOilMonth,
    updateDriveExceedOilDate : updateDriveExceedOilDate,
    getDriveExceedOilMonthCsv : getDriveExceedOilMonthCsv
}
