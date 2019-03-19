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
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
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

function getDriveExceedOilCsv(req,res,next){
    var csvString = "";
    var header = "超量结算编号" + ',' + "司机" + ',' + "核油日期" + ','+ "所用油量" + ','+ "所用尿素量"+','+ "实际用油量"
        + ','+ "实际尿素量" + ','+ "实际超量金额" + ','+ "状态";
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
                parkObj.planOil = rows[i].plan_oil;
                parkObj.planUrea = rows[i].plan_urea;
                parkObj.actualOil = rows[i].actual_oil;
                parkObj.actualUrea = rows[i].actual_urea;
                parkObj.actualMoney = rows[i].actual_money;
                if(rows[i].stat_status == 1){
                    parkObj.statStatus = "未扣";
                }else{
                    parkObj.statStatus = "已扣";
                }
                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.oilDate+","+parkObj.planOil+","+parkObj.planUrea
                    +","+parkObj.actualOil+","+parkObj.actualUrea+","+parkObj.actualMoney+","+parkObj.statStatus+ '\r\n';
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
    getDriveExceedOilCsv : getDriveExceedOilCsv
}
