/**
 * Created by zwl on 2018/9/25.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleCarDAO = require('../dao/SettleCarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('SettleCar.js');
var csv=require('csvtojson');
var fs = require('fs');

function createSettleCar(req,res,next){
    var params = req.params ;
    settleCarDAO.addSettleCar(params,function(error,result){
        if (error) {
            logger.error(' createSettleCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createSettleCar ' + 'success ');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function querySettleCar(req,res,next){
    var params = req.params ;
    settleCarDAO.getSettleCar(params,function(error,result){
        if (error) {
            logger.error(' querySettleCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateSettleCar(req,res,next){
    var params = req.params ;
    settleCarDAO.updateSettleCar(params,function(error,result){
        if (error) {
            logger.error(' updateSettleCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateSettleCar ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function uploadSettleCarFile(req,res,next){
    var params = req.params;
    var successedInsert = 0;
    var successedUpdate = 0;
    var csvFileName='./upload/upload.tmp';
    var file = req.files.file;
    var read = fs.createReadStream(file.path);
    var write = fs.createWriteStream(csvFileName);
    read.pipe(write);
    read.on("end_parsed", function () {
        fs.unlink(file.path, function (err) {

        })
    });
    csv().fromFile(csvFileName).then(function(objArray) {
        console.log(objArray);
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                vin : objArray[i].vin,
                entrustId : objArray[i].entrustId,
                routeStartId : objArray[i].routeStartId,
                routeEndId : objArray[i].routeEndId,
                price : objArray[i].price,
                row : i+1,
            }
            settleCarDAO.addSettleCar(subParams,function(err,result){
                if (err) {
                    logger.error(' createSettleCar ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createSettleCar ' + 'success');
                    }else{
                        logger.warn(' createSettleCar ' + 'failed');
                    }
                    that(null,i);
                }
            })
        })
        logger.info(' uploadSettleCarFile ' + 'success');
        resUtil.resetQueryRes(res, objArray);
        return next();
    })
}


module.exports = {
    createSettleCar : createSettleCar,
    querySettleCar : querySettleCar,
    updateSettleCar : updateSettleCar,
    uploadSettleCarFile : uploadSettleCarFile
}