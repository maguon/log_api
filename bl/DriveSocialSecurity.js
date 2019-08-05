/**
 * Created by zwl on 2019/5/10.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveSocialSecurityDAO = require('../dao/DriveSocialSecurityDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSocialSecurity.js');
var csv=require('csvtojson');
var fs = require('fs');

function createDriveSocialSecurity(req,res,next){
    var params = req.params ;
    driveSocialSecurityDAO.addDriveSocialSecurity(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "此数据已存在，操作失败");
                return next();
            } else{
                logger.error(' createDriveSocialSecurity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createDriveSocialSecurity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSocialSecurity(req,res,next){
    var params = req.params ;
    driveSocialSecurityDAO.getDriveSocialSecurity(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSocialSecurity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSocialSecurity ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveSocialSecurity(req,res,next){
    var params = req.params ;
    driveSocialSecurityDAO.updateDriveSocialSecurity(params,function(error,result){
        if (error) {
            logger.error(' updateDriveSocialSecurity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveSocialSecurity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function uploadDriveSocialSecurityFile(req,res,next){
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
                    driveName : objArray[i].司机姓名,
                    mobile : objArray[i].电话,
                    row : i+1,
                }
                driveDAO.getDrive(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getDrive ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.driveId = rows[0].id;
                        }else{
                            parkObj.driveId = 0;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(parkObj.driveId>0){
                    var subParams ={
                        driveId : parkObj.driveId,
                        driveName : objArray[i].司机姓名,
                        mobile : objArray[i].电话,
                        yMonth : objArray[i].月份,
                        socialSecurityFee : objArray[i].社保费,
                        row : i+1
                    }
                    driveSocialSecurityDAO.addDriveSocialSecurity(subParams,function(err,result){
                        if (err) {
                            logger.error(' addDriveSocialSecurity ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result&&result.insertId>0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' addDriveSocialSecurity ' + 'success');
                            }else{
                                logger.warn(' addDriveSocialSecurity ' + 'failed');
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
            logger.info(' uploadDriveSocialSecurityFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function getDriveSocialSecurityCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' +"司机姓名" + ',' + "手机号"+ ','+"社保费";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveSocialSecurityDAO.getDriveSocialSecurity(params,function(error,rows){
        if (error) {
            logger.error(' getDriveSocialSecurity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.yMonth = rows[i].y_month;
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].mobile == null){
                    parkObj.mobile = "";
                }else{
                    parkObj.mobile = rows[i].mobile;
                }
                if(rows[i].social_security_fee == null){
                    parkObj.socialSecurityFee = "";
                }else{
                    parkObj.socialSecurityFee = rows[i].social_security_fee;
                }
                csvString = csvString+parkObj.yMonth+","+parkObj.driveName+","+parkObj.mobile+","+parkObj.socialSecurityFee+ '\r\n';
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
    createDriveSocialSecurity : createDriveSocialSecurity,
    queryDriveSocialSecurity : queryDriveSocialSecurity,
    updateDriveSocialSecurity : updateDriveSocialSecurity,
    uploadDriveSocialSecurityFile : uploadDriveSocialSecurityFile,
    getDriveSocialSecurityCsv : getDriveSocialSecurityCsv
}