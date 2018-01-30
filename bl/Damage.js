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
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Damage.js');

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
                if(rows && rows.length>0&&rows[0].damage_status == sysConst.DAMAGE_STATUS.ready_process){
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
    damageDAO.updateDamageStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDamageStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageStatus ' + 'success');
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

function queryDamageMonthStat(req,res,next){
    var params = req.params;
    damageDAO.getDamageMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDamageMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDamageCsv(req,res,next){
    var csvString = "";
    var header = "质损编号" + ',' + "申报时间" + ',' + "VIN码" + ','+ "品牌" + ','+ "质损说明"+ ','+ "申报人" + ','+ "负责人" + ','+ "处理状态" ;
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
                parkObj.makeName = rows[i].make_name;
                parkObj.damageExplain = rows[i].damage_explain;
                parkObj.declareUserName = rows[i].declare_user_name;
                parkObj.underUserName = rows[i].under_user_name;
                if(rows[i].damage_status == 1){
                    parkObj.damageStatus = "待处理";
                }else if(rows[i].damage_status == 2){
                    parkObj.damageStatus = "处理中";
                }else{
                    parkObj.damageStatus = "已处理";
                }
                csvString = csvString+parkObj.id+","+parkObj.createdOn+","+parkObj.vin+","
                    +parkObj.makeName+","+parkObj.damageExplain+","+parkObj.declareUserName+","
                    +parkObj.underUserName+","+parkObj.damageStatus+ '\r\n';
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
    createQualityAssurance : createQualityAssurance ,
    queryDamageMonthStat : queryDamageMonthStat,
    getDamageCsv : getDamageCsv
}