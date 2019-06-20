/**
 * Created by zwl on 2017/10/31.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var damageDAO = require('../dao/DamageDAO.js');
var damageCheckDAO = require('../dao/DamageCheckDAO.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Damage.js');
var csv=require('csvtojson');
var fs = require('fs');

function createDamage(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        if(params.carId>0){
            carDAO.getCarList({carId:params.carId},function(error,rows){
                if (error) {
                    logger.error(' getCarList ' + error.message);
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                } else {
                    if(rows && rows.length>0){
                        that();
                    }else{
                        logger.warn(' getCarList ' + 'failed');
                        resUtil.resetFailedRes(res," VIN码不存在，不能进行下一步 ");
                        return next();
                    }
                }
            })
        }else{
            logger.warn(' getCarList ' + 'failed');
            resUtil.resetFailedRes(res," VIN码不能为空 ");
            return next();
        }
    }).seq(function(){
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        damageDAO.addDamage(params,function(error,result){
            if (error) {
                logger.error(' createDamage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createDamage ' + 'success');
                req.params.op = sysConst.CAR_OP_TYPE.QUALITY;
                req.params.carContent = " 增加质损记录 " + result.insertId;
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDamage(req,res,next){
    var params = req.params;
    if(params.vinCode!=null&&params.vinCode.length<6){
        resUtil.resetFailedRes(res,null);
        return next();
    }
    damageDAO.getDamage(params,function(error,result){
        if (error) {
            logger.error(' queryDamage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageBase(req,res,next){
    var params = req.params;
    damageDAO.getDamageBase(params,function(error,result){
        if (error) {
            logger.error(' queryDamageBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageCheckCount(req,res,next){
    var params = req.params;
    damageDAO.getDamageCheckCount(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheckCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheckCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageNotCheckCount(req,res,next){
    var params = req.params;
    damageDAO.getDamageNotCheckCount(params,function(error,result){
        if (error) {
            logger.error(' queryDamageNotCheckCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageNotCheckCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageTotalCost(req,res,next){
    var params = req.params;
    damageDAO.getDamageTotalCost(params,function(error,result){
        if (error) {
            logger.error(' queryDamageTotalCost ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageTotalCost ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDamage(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        damageDAO.getDamage({damageId:params.damageId},function(error,rows){
            if (error) {
                logger.error(' getDamage ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].damage_status != sysConst.DAMAGE_STATUS.completed){
                    that();
                }else{
                    logger.warn(' getDamage ' + 'failed');
                    resUtil.resetFailedRes(res," 非待处理状态，不能进行修改 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        damageDAO.updateDamage(params,function(error,result){
            if (error) {
                logger.error(' updateDamage ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDamage ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateDamageStatus(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        damageDAO.updateDamageStatus(params,function(error,result){
            if (error) {
                logger.error(' updateDamageStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageStatus ' + 'success');
                    that();
                }else{
                    logger.warn(' updateDamageStatus ' + 'failed');
                    resUtil.resetFailedRes(res," 质损处理完成失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        damageCheckDAO.updateDamageCheckFinishTime(params,function(error,result){
            if (error) {
                logger.error(' updateDamageCheckFinishTime ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDamageCheckFinishTime ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateDamageHangStatus(req,res,next){
    var params = req.params ;
    damageDAO.updateDamageHangStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDamageHangStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageHangStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function createQualityAssurance(req,res,next){
    var params = req.params;
    req.params.carContent =" 质检 ";
    req.params.op =sysConst.CAR_OP_TYPE.QUALITY;
    logger.info(' createQualityAssurance ' + params.vin)
    resUtil.resetCreateRes(res,{insertId:1},null);
    return next();
}

function queryDamageTypeMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageTypeMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageTypeMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageTypeMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageLinkTypeMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageLinkTypeMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageLinkTypeMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageLinkTypeMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageTypeWeekStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageTypeWeekStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageTypeWeekStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageTypeWeekStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageMakeMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageMakeMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageMakeMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageMakeMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageReceiveMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageReceiveMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageReceiveMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageReceiveMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageDaseAddrMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageDaseAddrMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageDaseAddrMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageDaseAddrMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageMakeTopMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageMakeTopMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageMakeTopMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageMakeTopMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageReceiveTopMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageReceiveTopMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageReceiveTopMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageReceiveTopMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDamageDaseAddrTopMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageDaseAddrTopMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageDaseAddrTopMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageDaseAddrTopMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function uploadDamageFile(req,res,next){
    var params = req.params;
    var parkObj = {};
    var myDate = new Date();
    var successedInsert = 0;
    var failedCase = 0;
    //var obj={'VIN':'vin','品牌ID':'makeId','委托方ID':'entrustId','起始地ID':'routeStartId','目的地ID':'routeEndId','经销商ID':'receiveId'};
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                vin : objArray[i].VIN,
                entrustId : objArray[i].委托方ID,
                routeStartId : objArray[i].起始地ID,
                baseAddrId : objArray[i].起始装车地ID,
                routeEndId : objArray[i].目的地ID,
                receiveId : objArray[i].经销商ID,
                row : i+1,
            }
            Seq().seq(function(){
                var that = this;
                carDAO.getCarList(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getCarList ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.carId = rows[0].id;
                            parkObj.damageExplain = objArray[i].质损说明;
                        }else{
                            parkObj.carId = 0;
                        }
                        that();
                    }
                })

            }).seq(function(){
                if(parkObj.carId>0){
                    var subParams ={
                        userId : params.userId,
                        carId : parkObj.carId,
                        dateId : parseInt(moment(myDate).format('YYYYMMDD')),
                        damageExplain : parkObj.damageExplain,
                        uploadId : params.uploadId,
                        row : i+1,
                    }
                    damageDAO.addUploadDamage(subParams,function(err,result){
                        if (err) {
                            logger.error(' createUploadDamage ' + err.message);
                            //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                            that(null,i);
                        } else {
                            if(result&&result.insertId>0){
                                successedInsert = successedInsert+result.affectedRows;
                                logger.info(' createUploadDamage ' + 'success');
                            }else{
                                logger.warn(' createUploadDamage ' + 'failed');
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
            logger.info(' uploadDamageFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}

function getDamageCsv(req,res,next){
    var csvString = "";
    var header = "质损编号" + ',' + "申报时间" + ',' + "VIN码" + ','+ "品牌" + ','+ "质损说明"+ ','+ "申报人" + ','+ "货车牌号" + ','+
        "司机" + ','+ "经销商" + ','+ "委托方" + ','+ "质损类型"+ ','+ "质损环节" + ','+ "责任人" + ','+ "个人承担" + ','+ "公司承担" + ','+
        "处理结束时间" + ','+"处理状态"+ ','+
    "理赔编号" + ','+ "生成日期" + ','+ "保险公司" + ','+ "经办人"+ ','+ "待赔金额" + ','+ "定损金额" + ','+ "保险赔付";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    damageDAO.getDamageInsureRel(params,function(error,rows){
        if (error) {
            logger.error(' getDamageInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                if(rows[i].damage_explain==null){
                    parkObj.damageExplain = "";
                }else{
                    parkObj.damageExplain = rows[i].damage_explain;
                }
                parkObj.declareUserName = rows[i].declare_user_name;
                if(rows[i].truck_num==null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                if(rows[i].drive_name==null){
                    parkObj.driveName = "";
                }else{
                    parkObj.driveName = rows[i].drive_name;
                }
                if(rows[i].re_short_name==null){
                    parkObj.reShortName = "";
                }else{
                    parkObj.reShortName = rows[i].re_short_name;
                }
                if(rows[i].en_short_name==null){
                    parkObj.enShortName = "";
                }else{
                    parkObj.enShortName = rows[i].en_short_name;
                }
                if(rows[i].damage_type == 1){
                    parkObj.damageType = "A级";
                }else if(rows[i].damage_type == 2){
                    parkObj.damageType = "B级";
                }else if(rows[i].damage_type == 3){
                    parkObj.damageType = "C级";
                }else if(rows[i].damage_type == 4){
                    parkObj.damageType = "D级";
                }else if(rows[i].damage_type == 6){
                    parkObj.damageType = "F级";
                }else if(rows[i].damage_type == 7){
                    parkObj.damageType = "买断车";
                }else if(rows[i].damage_type == 8){
                    parkObj.damageType = "退库车";
                }else{
                    parkObj.damageType = "";
                }
                if(rows[i].damage_link_type == 1){
                    parkObj.damageLinkType = "短驳移库";
                }else if(rows[i].damage_link_type == 2){
                    parkObj.damageLinkType = "公路运输";
                }else if(rows[i].damage_link_type == 3){
                    parkObj.damageLinkType = "公司运输";
                }else if(rows[i].damage_link_type == 4){
                    parkObj.damageLinkType = "驾驶员漏检";
                }else if(rows[i].damage_link_type == 5){
                    parkObj.damageLinkType = "交通事故";
                }else if(rows[i].damage_link_type == 6){
                    parkObj.damageLinkType = "前端责任";
                }else if(rows[i].damage_link_type == 7){
                    parkObj.damageLinkType = "安盛船务责任";
                }else if(rows[i].damage_link_type == 8){
                    parkObj.damageLinkType = "安盛判定";
                }else if(rows[i].damage_link_type == 9){
                    parkObj.damageLinkType = "通用判定";
                }else if(rows[i].damage_link_type == 10){
                    parkObj.damageLinkType = "驾驶员违规操作";
                }else if(rows[i].damage_link_type == 11){
                    parkObj.damageLinkType = "长春办收发车";
                }else if(rows[i].damage_link_type == 12){
                    parkObj.damageLinkType = "沈阳办收发车";
                }else if(rows[i].damage_link_type == 13){
                    parkObj.damageLinkType = "天津办收发车";
                }else if(rows[i].damage_link_type == 14){
                    parkObj.damageLinkType = "PDI漏检";
                }else if(rows[i].damage_link_type == 15){
                    parkObj.damageLinkType = "大连现场收发车";
                }else if(rows[i].damage_link_type == 16){
                    parkObj.damageLinkType = "运输途中遭人为破坏";
                }else{
                    parkObj.damageLinkType = "";
                }
                if(rows[i].under_user_name==null){
                    parkObj.underUserName = "";
                }else{
                    parkObj.underUserName = rows[i].under_user_name;
                }
                if(rows[i].under_cost==null){
                    parkObj.underCost = "";
                }else{
                    parkObj.underCost = rows[i].under_cost;
                }
                if(rows[i].company_cost==null){
                    parkObj.companyCost = "";
                }else{
                    parkObj.companyCost = rows[i].company_cost;
                }
                if(rows[i].check_end_date==null){
                    parkObj.checkEndDate = "";
                }else{
                    parkObj.checkEndDate = rows[i].check_end_date;
                }
                if(rows[i].damage_status == 1){
                    parkObj.damageStatus = "待处理";
                }else if(rows[i].damage_status == 2){
                    parkObj.damageStatus = "处理中";
                }else{
                    parkObj.damageStatus = "已处理";
                }

                if(rows[i].damage_insure_id==null){
                    parkObj.damageInsureId = "";
                }else{
                    parkObj.damageInsureId = rows[i].damage_insure_id;
                }
                if(rows[i].insure_created_on==null){
                    parkObj.insureCreatedOn = "";
                }else{
                    parkObj.insureCreatedOn = new Date(rows[i].insure_created_on).toLocaleDateString();
                }
                if(rows[i].insure_name==null){
                    parkObj.insureName = "";
                }else{
                    parkObj.insureName = rows[i].insure_name;
                }
                if(rows[i].insure_user_name==null || rows[i].damage_insure_id==null){
                    parkObj.insureUserName = "";
                }else{
                    parkObj.insureUserName = rows[i].insure_user_name;
                }
                if(rows[i].insure_plan==null){
                    parkObj.insurePlan = "";
                }else{
                    parkObj.insurePlan = rows[i].insure_plan;
                }
                if(rows[i].damage_money==null){
                    parkObj.damageMoney = "";
                }else{
                    parkObj.damageMoney = rows[i].damage_money;
                }
                if(rows[i].insure_actual==null){
                    parkObj.insureActual = "";
                }else{
                    parkObj.insureActual = rows[i].insure_actual;
                }
                csvString = csvString+parkObj.id+","+parkObj.createdOn+","+parkObj.vin+"," +parkObj.makeName+","+parkObj.damageExplain+","+
                    parkObj.declareUserName+"," +parkObj.truckNum+"," +parkObj.driveName+","+parkObj.reShortName+","+parkObj.enShortName+","+
                    parkObj.damageType+","+parkObj.damageLinkType+","+parkObj.underUserName+","+parkObj.underCost+","+
                    parkObj.companyCost+","+parkObj.checkEndDate+","+parkObj.damageStatus+","+
                parkObj.damageInsureId+","+parkObj.insureCreatedOn+","+parkObj.insureName+","+
                parkObj.insureUserName+","+parkObj.insurePlan+","+parkObj.damageMoney+","+parkObj.insureActual+'\r\n';
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

function getDamageBaseCsv(req,res,next){
    var csvString = "";
    var header = "质损编号" + ',' + "申报时间" + ',' + "VIN码" + ','+ "品牌" + ','+ "委托方"+ ','+ "经销商" + ','+ "司机" + ','+ "货车牌号" + ','+
        "申报人" + ','+ "质损说明" + ','+ "处理状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    damageDAO.getDamage(params,function(error,rows){
        if (error) {
            logger.error(' queryDamage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                parkObj.vin = rows[i].vin;
                if(rows[i].make_name==null){
                    parkObj.makeName = "";
                }else{
                    parkObj.makeName = rows[i].make_name;
                }
                if(rows[i].en_short_name==null){
                    parkObj.enShortName = "";
                }else{
                    parkObj.enShortName = rows[i].en_short_name;
                }
                if(rows[i].re_short_name==null){
                    parkObj.reShortName = "";
                }else{
                    parkObj.reShortName = rows[i].re_short_name;
                }
                if(rows[i].drive_name==null){
                    parkObj.driveName = "";
                }else{
                    parkObj.driveName = rows[i].drive_name;
                }
                if(rows[i].truck_num==null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                parkObj.declareUserName = rows[i].declare_user_name;
                if(rows[i].damage_explain==null){
                    parkObj.damageExplain = "";
                }else{
                    parkObj.damageExplain = rows[i].damage_explain;
                }
                if(rows[i].damage_status == 1){
                    parkObj.damageStatus = "待处理";
                }else if(rows[i].damage_status == 2){
                    parkObj.damageStatus = "处理中";
                }else{
                    parkObj.damageStatus = "已处理";
                }
                csvString = csvString+parkObj.id+","+parkObj.createdOn+","+parkObj.vin+","+parkObj.makeName+","+parkObj.enShortName+","+
                    parkObj.reShortName+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.declareUserName+","+parkObj.damageExplain+","+
                    parkObj.damageStatus+ '\r\n';
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
    createDamage : createDamage,
    queryDamage : queryDamage,
    queryDamageBase : queryDamageBase,
    queryDamageCheckCount : queryDamageCheckCount,
    queryDamageNotCheckCount : queryDamageNotCheckCount,
    queryDamageTotalCost : queryDamageTotalCost,
    updateDamage : updateDamage,
    updateDamageStatus : updateDamageStatus ,
    updateDamageHangStatus : updateDamageHangStatus,
    createQualityAssurance : createQualityAssurance ,
    queryDamageTypeMonthStat : queryDamageTypeMonthStat,
    queryDamageLinkTypeMonthStat : queryDamageLinkTypeMonthStat,
    queryDamageTypeWeekStat : queryDamageTypeWeekStat,
    queryDamageMakeMonthStat : queryDamageMakeMonthStat,
    queryDamageReceiveMonthStat : queryDamageReceiveMonthStat,
    queryDamageDaseAddrMonthStat : queryDamageDaseAddrMonthStat,
    queryDamageMakeTopMonthStat : queryDamageMakeTopMonthStat,
    queryDamageReceiveTopMonthStat : queryDamageReceiveTopMonthStat,
    queryDamageDaseAddrTopMonthStat : queryDamageDaseAddrTopMonthStat,
    uploadDamageFile : uploadDamageFile,
    getDamageCsv : getDamageCsv,
    getDamageBaseCsv : getDamageBaseCsv
}