/**
 * Created by zwl on 2017/3/15.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var driveDAO = require('../dao/DriveDAO.js');
var userDAO = require('../dao/UserDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Drive.js');

function createDrive(req,res,next){
    var params = req.params;
    var userId = 0;
    var driveId = 0;
    Seq().seq(function(){
        var that = this;
        params.mobile = params.tel;
        userDAO.getUser({mobile:params.mobile},function(error,rows){
            if (error) {
                logger.error(' createUser ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' createUser ' +params.mobile+ sysMsg.CUST_SIGNUP_REGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.CUST_SIGNUP_REGISTERED) ;
                    return next();
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.mobile = params.tel;
        params.realName = params.driveName
/*        var password = "";
        for(var i =0;i<6;i++){
            password+=Math.floor(Math.random()*10);
        }*/
        params.password = encrypt.encryptByMd5('888888');
        params.type = sysConst.USER_TYPE.drive_op;
        userDAO.addUser(params,function(error,result){
            if (error) {
                logger.error(' createUser ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result && result.insertId>0){
                    logger.info(' createUser ' + 'success');
                    var user = {
                        userId : result.insertId,
                        userStatus : listOfValue.USER_STATUS_ACTIVE
                    }
                    user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);
                    userId = result.insertId
                    that();
                }else{
                    logger.warn(' createUser ' + 'false');
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                }
            }
        })
    }).seq(function(){
        params.userId = userId;
        driveDAO.addDrive(params,function(error,result){
            if (error) {
                logger.error(' createDrive ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createDrive ' + 'success');
                req.params.driverContent =" 新增司机 ";
                req.params.tid = result.insertId;
                req.params.driverOp =30;
                resUtil.resetQueryRes(res,{userId:userId,driveId:result.insertId},null);
                return next();
            }
        })
    })
}

function queryDrive(req,res,next){
    var params = req.params ;
    driveDAO.getDrive(params,function(error,result){
        if (error) {
            logger.error(' queryDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrive ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryLicenseCount(req,res,next){
    var params = req.params ;
    driveDAO.getLicenseCount(params,function(error,result){
        if (error) {
            logger.error(' queryLicenseCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryLicenseCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveCount(req,res,next){
    var params = req.params ;
    driveDAO.getDriveCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveOperateTypeCount(req,res,next){
    var params = req.params ;
    driveDAO.getDriveOperateTypeCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveOperateTypeCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveOperateTypeCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSettle(req,res,next){
    var params = req.params ;
    driveDAO.getDriveSettle(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSettle ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSettle ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDrive(req,res,next){
    var params = req.params ;
    driveDAO.updateDrive(params,function(error,result){
        if (error) {
            logger.error(' updateDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDrive ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveCompany(req,res,next){
    var params = req.params ;
    driveDAO.updateDriveCompany(params,function(error,result){
        if (error) {
            logger.error(' updateDriveCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveCompany ' + 'success');
            req.params.driverContent =" 修改所属公司为 "+params.companyName;
            req.params.tid = params.driveId;
            req.params.driverOp =30;
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveImage(req,res,next){
    var params = req.params ;
    if(params.imageType==1){
        driveDAO.updateDriveImage(params,function(error,result){
            if (error) {
                logger.error(' updateDriveImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriveImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
    if(params.imageType==2){
        driveDAO.updateDriveImageRe(params,function(error,result){
            if (error) {
                logger.error(' updateDriveImageRe ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriveImageRe ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
    if(params.imageType==3){
        driveDAO.updateLicenseImage(params,function(error,result){
            if (error) {
                logger.error(' updateLicenseImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateLicenseImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
    if(params.imageType==4){
        driveDAO.updateOpLicenseImage(params,function(error,result){
            if (error) {
                logger.error(' updateOpLicenseImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateOpLicenseImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
    if(params.imageType==5){
        driveDAO.updateDriverAvatarImage(params,function(error,result){
            if (error) {
                logger.error(' updateDriverAvatarImage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriverAvatarImage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    }
}

function updateDriveStatus (req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        driveDAO.getDrive({driveId:params.driveId},function(error,rows){
            if (error) {
                logger.error(' getDrive ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    if(rows[0].truck_num!=null || rows[0].vice!=null){
                        logger.warn(' getDrive ' +params.driveId+ sysMsg.CUST_DRIVE_BIND);
                        resUtil.resetFailedRes(res,sysMsg.CUST_DRIVE_BIND);
                        return next();
                    }else{
                        that();
                    }
                }else{
                    that();
                }
            }
        })
    }).seq(function(){
        driveDAO.updateDriveStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDriveStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriveStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function getDriveSettleCsv(req,res,next){
    var csvString = "";
    var header = "司机姓名" + ',' + "所属类型" + ',' + "所属公司" + ','+ "货车牌号" + ','+ "商品车台数"+ ','+ "委托方总价" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveDAO.getDriveSettle(params,function(error,rows){
        if (error) {
            logger.error(' getDriveSettle ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else if(rows[i].operate_type == 2){
                    parkObj.operateType = "外协";
                }else if(rows[i].operate_type == 3){
                    parkObj.operateType = "供方";
                }else{
                    parkObj.operateType = "承包";
                }
                parkObj.companyName = rows[i].company_name;
                if(rows[i].truck_num == null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                if(rows[i].car_count == null){
                    parkObj.carCount = "";
                }else{
                    parkObj.carCount = rows[i].car_count;
                }
                if(rows[i].value_total == null){
                    parkObj.valueTotal = "";
                }else{
                    parkObj.valueTotal = rows[i].value_total;
                }
                csvString = csvString+parkObj.driveName+","+parkObj.operateType+","+parkObj.companyName+","+parkObj.truckNum+","+parkObj.carCount+","+parkObj.valueTotal+ '\r\n';
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
    createDrive : createDrive,
    queryDrive : queryDrive,
    queryLicenseCount : queryLicenseCount,
    queryDriveCount : queryDriveCount,
    queryDriveOperateTypeCount : queryDriveOperateTypeCount,
    queryDriveSettle : queryDriveSettle,
    updateDrive : updateDrive,
    updateDriveCompany : updateDriveCompany,
    updateDriveImage : updateDriveImage,
    updateDriveStatus : updateDriveStatus,
    getDriveSettleCsv : getDriveSettleCsv
}