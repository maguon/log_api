/**
 * Created by yjy on 2020/3/5.
 */
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var driveSundryFeeDAO = require('../dao/DriveSundryFeeDAO.js');
var driveDAO = require('../dao/DriveDAO.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveWork.js');
var csv = require('csvtojson');
var fs = require('fs');

function createDriveSundryFee(req, res, next) {
    var params = req.params;
    driveSundryFeeDAO.addDriveSundryFee(params, function (error, result) {
        if (error) {
            logger.error(' createDriveSundryFee ' + error.message);
            throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveSundryFee ' + 'success');
            resUtil.resetCreateRes(res, result, null);
            return next();
        }
    })
}

function updateDriveSundryFee(req,res,next){
  var params = req.params ;
  driveSundryFeeDAO.updateDriveSundryFee(params,function(error,result){
    if (error) {
      logger.error(' updateDriveSundryFee ' + error.message);
      throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
    } else {
      logger.info(' updateDriveSundryFee ' + 'success');
      resUtil.resetUpdateRes(res,result,null);
      return next();
    }
  })
}

function queryDriveSundryFee(req, res, next) {
    var params = req.params;
    driveSundryFeeDAO.getDriveSundryFee(params, function (error, result) {
        if (error) {
            logger.error(' queryDriveSundryFee ' + error.message);
            throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSundryFee ' + 'success');
            resUtil.resetQueryRes(res, result, null);
            return next();
        }
    })
}

function uploadDriveSundryFee(req, res, next) {
    var hasFlag = false;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function (objArray) {
        Seq(objArray).seqEach(function (rowObj, i) {
            var that = this;
            Seq().seq(function () {
                var that = this;
                var subParams = {
                    driveName: objArray[i].司机姓名,
                    mobile: objArray[i].电话,
                    row: i + 1,
                };
                // 根据 【司机姓名，电话】 取得司机ID，用户ID
                driveDAO.getDrive(subParams, function (error, rows) {
                    if (error) {
                        logger.error(' getDrive ' + error.message);
                        throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if (rows && rows.length == 1) {
                            parkObj.driveId = rows[0].id;
                            parkObj.userId = rows[0].user_id;
                        } else {
                            parkObj.driveId = 0;
                            parkObj.userId = 0;
                        }
                        that();
                    }
                })
            }).seq(function () {
                var that = this;
                var subParams = {
                    userId: parkObj.userId,
                    driveId: parkObj.driveId,
                    yMonth: objArray[i].月份,
                    row: i + 1,
                };
                // 通过 取得司机ID，用户ID 查询是否 已经存在
                driveSundryFeeDAO.getDriveSundryFee(subParams, function (error, rows) {
                    if (error) {
                        logger.error(' getDriveSundryFee ' + error.message);
                        throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        hasFlag = (rows && rows.length == 1);
                        that();
                    }
                })
            }).seq(function () {
                if (parkObj.driveId > 0 && parkObj.userId > 0) {
                    if (!hasFlag) {
                        var subParams = {
                            userId: parkObj.userId,
                            driveId: parkObj.driveId,
                            yMonth: objArray[i].月份,
                            personalLoan: objArray[i].个人借款,
                            socialFee: objArray[i].社保费,
                            mealsFee: objArray[i].伙食费,
                            otherFee: 0,
                            row: i + 1
                        };
                        driveSundryFeeDAO.addDriveSundryFee(subParams, function (err, result) {
                            if (err) {
                                logger.error(' addDriveSundryFee ' + err.message);
                                that(null, i);
                            } else {
                                if (result && result.insertId > 0) {
                                    successedInsert = successedInsert + result.affectedRows;
                                    logger.info(' addDriveSundryFee ' + 'success');
                                } else {
                                    logger.warn(' addDriveSundryFee ' + 'failed');
                                }
                                that(null, i);
                            }
                        })
                    } else {
                        that(null, i);
                    }
                } else {
                    that(null, i);
                }
            })
        }).seq(function () {
            fs.unlink(file.path, function () {
            });
            failedCase = objArray.length - successedInsert;
            logger.info(' uploadDriveSundryFee ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert: successedInsert, failedCase: failedCase}, null);
            return next();
        })
    })
}

function uploadDriveSundryOtherFee(req, res, next) {
    var hasFlag = false;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function (objArray) {
        Seq(objArray).seqEach(function (rowObj, i) {
            var that = this;
            Seq().seq(function () {
                var that = this;
                var subParams = {
                    driveName: objArray[i].司机姓名,
                    mobile: objArray[i].电话,
                    row: i + 1,
                };
                // 根据 【司机姓名，电话】 取得司机ID，用户ID
                driveDAO.getDrive(subParams, function (error, rows) {
                    if (error) {
                        logger.error(' getDrive ' + error.message);
                        throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        if (rows && rows.length == 1) {
                            parkObj.driveId = rows[0].id;
                            parkObj.userId = rows[0].user_id;
                        } else {
                            parkObj.driveId = 0;
                            parkObj.userId = 0;
                        }
                        that();
                    }
                })
            }).seq(function () {
                var that = this;
                var subParams = {
                    userId: parkObj.userId,
                    driveId: parkObj.driveId,
                    yMonth: objArray[i].月份,
                    row: i + 1,
                };
                // 通过 取得司机ID，用户ID 查询是否 已经存在
                driveSundryFeeDAO.getDriveSundryFee(subParams, function (error, rows) {
                    if (error) {
                        logger.error(' getDriveSundryFee ' + error.message);
                        throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else {
                        hasFlag = (rows && rows.length == 1);
                        that();
                    }
                })
            }).seq(function () {
                if (parkObj.driveId > 0 && parkObj.userId > 0) {
                    if (!hasFlag) {
                        var subParams = {
                            userId: parkObj.userId,
                            driveId: parkObj.driveId,
                            yMonth: objArray[i].月份,
                            personalLoan: 0,
                            socialFee: 0,
                            mealsFee: 0,
                            otherFee: objArray[i].其他扣款,
                            row: i + 1
                        };
                        driveSundryFeeDAO.addDriveSundryFee(subParams, function (err, result) {
                            if (err) {
                                logger.error(' addDriveSundryFee ' + err.message);
                                that(null, i);
                            } else {
                                if (result && result.insertId > 0) {
                                    successedInsert = successedInsert + result.affectedRows;
                                    logger.info(' addDriveSundryFee ' + 'success');
                                } else {
                                    logger.warn(' addDriveSundryFee ' + 'failed');
                                }
                                that(null, i);
                            }
                        })
                    } else {
                        var subParams = {
                            userId: parkObj.userId,
                            driveId: parkObj.driveId,
                            yMonth: objArray[i].月份,
                            otherFee: objArray[i].其他扣款,
                            row: i + 1
                        };
                        driveSundryFeeDAO.updateDriveSundryOtherFee(subParams, function (err, result) {
                            if (err) {
                                logger.error(' updateDriveSundryFee ' + err.message);
                                that(null, i);
                            } else {
                                if (result && result.affectedRows > 0) {
                                    successedInsert = successedInsert + result.affectedRows;
                                    logger.info(' updateDriveSundryOtherFee ' + 'success');
                                } else {
                                    logger.warn(' updateDriveSundryOtherFee ' + 'failed');
                                }
                                that(null, i);
                            }
                        })
                    }
                } else {
                    that(null, i);
                }
            })
        }).seq(function () {
            fs.unlink(file.path, function () {
            });
            failedCase = objArray.length - successedInsert;
            logger.info(' updateDriveSundryOtherFee ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert: successedInsert, failedCase: failedCase}, null);
            return next();
        })
    })
}

function getDriveSundryFeeCsv(req,res,next){
    var csvString = "";
    var header = "司机姓名" + ',' + "电话" + ',' + "月份" + ','+ "个人借款" + ','+ "社保费" + ','+ "伙食费" + ','+ "其他扣款";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveSundryFeeDAO.getDriveSundryFee(params,function(error,rows){
        if (error) {
            logger.error(' getDriveSundryFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.driveName = rows[i].drive_name;
                parkObj.mobile = rows[i].tel;
                parkObj.yMonth = rows[i].y_month;
                parkObj.personalLoan = rows[i].personal_loan;
                parkObj.socialFee = rows[i].social_fee;
                parkObj.mealsFee = rows[i].meals_fee;
                parkObj.otherFee = rows[i].other_fee;
                csvString = csvString+parkObj.driveName+","+parkObj.mobile+","+parkObj.yMonth+","+parkObj.personalLoan+","+
                    parkObj.socialFee+ "," + parkObj.mealsFee+ "," + parkObj.otherFee+'\r\n';
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

module.exports = {
    createDriveSundryFee: createDriveSundryFee,
    updateDriveSundryFee : updateDriveSundryFee,
    queryDriveSundryFee: queryDriveSundryFee,
    uploadDriveSundryFee: uploadDriveSundryFee,
    uploadDriveSundryOtherFee: uploadDriveSundryOtherFee,
    getDriveSundryFeeCsv: getDriveSundryFeeCsv
};