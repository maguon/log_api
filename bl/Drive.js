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
        params.realName = params.driveName;
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
        if(params.socialType == null){
            params.socialType = 1;
        }
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

function queryDriveTruckCount(req,res,next){
    var params = req.params ;
    driveDAO.getDriveTruckCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveTruckCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveTruckCount ' + 'success');
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
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        driveDAO.getDrive({driveId:params.driveId},function(error,rows){
            if (error) {
                logger.error(' getDrive ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    parkObj.initCompanyName = rows[0].company_name;
                    parkObj.operateType = rows[0].operate_type;
                    that();
                }else{
                    logger.warn(' getDrive ' + 'failed');
                    resUtil.resetFailedRes(res, " 司机不存在，操作失败 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        if(parkObj.operateType==1){
            parkObj.operateType ="自营";
        }else{
            parkObj.operateType ="外协";
        }
        if(params.operateType==1){
            parkObj.newOperateType ="自营";
        }else{
            parkObj.newOperateType ="外协";
        }
        driveDAO.updateDriveCompany(params,function(error,result){
            if (error) {
                logger.error(' updateDriveCompany ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDriveCompany ' + 'success');
                req.params.driverContent ="原所属类型 " +parkObj.operateType+" 修改为 "+parkObj.newOperateType+
                    " 原所属公司 "+parkObj.initCompanyName+" 修改为 "+params.companyName;
                req.params.tid = params.driveId;
                req.params.driverOp =30;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateDriveBankNumber(req,res,next){
    var params = req.params ;
    driveDAO.updateDriveBankNumber(params,function(error,result){
        if (error) {
            logger.error(' updateDriveBankNumber ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveBankNumber ' + 'success');
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

function updateDriveLevel(req,res,next){
    var params = req.params ;
    driveDAO.updateDriveLevel(params,function(error,result){
        if (error) {
            logger.error(' updateDriveLevel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveLevel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })

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

function getDriveCsv(req,res,next){
    var csvString = "";
    var header = "姓名" + ',' + "运营状态" + ',' + "性别" + ','+ "所属类型" + ',' + "所属公司" + ',' + "社保类型" + ',' + "主驾货车" + ','+
        "电话" + ','+ "身份证号" + ','+ "入职时间" + ','+ "档案编号" + ','+  "驾驶类型" + ','+ "驾驶证到期时间"+ ','+ "紧急联系人电话" + ','+ "家庭住址" + ','+ "备注";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveDAO.getDrive(params,function(error,rows){
        if (error) {
            logger.error(' getDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].operate_flag == 1){
                    parkObj.operateFlag = "可用";
                }else{
                    parkObj.operateFlag = "不可用";
                }
                if(rows[i].gender == 1){
                    parkObj.gender = "男";
                }else{
                    parkObj.gender = "女";
                }
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else if(rows[i].operate_type == 2){
                    parkObj.operateType = "外协";
                }else if(rows[i].operate_type == 3){
                    parkObj.operateType = "供方";
                }else{
                    parkObj.operateType = "承包";
                }
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                if(rows[i].social_type == 1){
                    parkObj.socialType = "在保";
                }else if(rows[i].social_type == 2){
                    parkObj.socialType = "未保";
                }else{
                    parkObj.socialType = "退保";
                }
                if(rows[i].truck_num == null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                parkObj.mobile = rows[i].mobile;
                if(rows[i].id_number == null){
                    parkObj.idNumber = "";
                }else{
                    parkObj.idNumber = rows[i].id_number;
                }
                if(rows[i].entry_time == null){
                    parkObj.entryTime = "";
                }else{
                    parkObj.entryTime = new Date(rows[i].entry_time).toLocaleDateString();
                }
                if(rows[i].archives_num == null){
                    parkObj.archivesNum = "";
                }else{
                    parkObj.archivesNum = rows[i].archives_num;
                }
                if(rows[i].license_type == 1){
                    parkObj.licenseType = "A1";
                }else if(rows[i].license_type == 2){
                    parkObj.licenseType = "A2";
                }else if(rows[i].license_type == 3){
                    parkObj.licenseType = "A3";
                }else if(rows[i].license_type == 4){
                    parkObj.licenseType = "B1";
                }else if(rows[i].license_type == 5){
                    parkObj.licenseType = "B2";
                }else if(rows[i].license_type == 6){
                    parkObj.licenseType = "C1";
                }else if(rows[i].license_type == 7){
                    parkObj.licenseType = "C2";
                }else{
                    parkObj.licenseType = "C3";
                }
                if(rows[i].license_date == null){
                    parkObj.licenseDate = "";
                }else{
                    parkObj.licenseDate = new Date(rows[i].license_date).toLocaleDateString();
                }
                if(rows[i].sib_tel == null){
                    parkObj.sibTel = "";
                }else{
                    parkObj.sibTel = rows[i].sib_tel;
                }
                if(rows[i].address == null){
                    parkObj.address = "";
                }else{
                    parkObj.address = rows[i].address;
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark.replace(/[\r\n]/g, '');
                }
                csvString = csvString+parkObj.driveName+","+parkObj.operateFlag+","+parkObj.gender+","+parkObj.operateType+","+
                    parkObj.companyName +","+parkObj.socialType +","+parkObj.truckNum+","+parkObj.mobile+","+parkObj.idNumber+","+
                    parkObj.entryTime+","+ parkObj.archivesNum+","+ parkObj.licenseType +","+
                    parkObj.licenseDate+","+parkObj.sibTel+","+parkObj.address+","+parkObj.remark+ '\r\n';
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
    queryDriveTruckCount : queryDriveTruckCount,
    updateDrive : updateDrive,
    updateDriveCompany : updateDriveCompany,
    updateDriveBankNumber : updateDriveBankNumber,
    updateDriveImage : updateDriveImage,
    updateDriveLevel : updateDriveLevel,
    updateDriveStatus : updateDriveStatus,
    getDriveCsv : getDriveCsv
}