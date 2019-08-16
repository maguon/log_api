/**
 * Created by zwl on 2018/3/2.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var damageCheckIndemnityDAO = require('../dao/DamageCheckIndemnityDAO.js');
var damageCheckDAO = require('../dao/DamageCheckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DamageCheckIndemnity.js');

function createDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    var indemnityId = 0;
    Seq().seq(function(){
        var that = this;
        damageCheckIndemnityDAO.addDamageCheckIndemnity(params,function(error,result){
            if (error) {
                logger.error(' createDamageCheckIndemnity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDamageCheckIndemnity ' + 'success');
                    indemnityId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create damageCheckIndemnity failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.damageIndemnityStatus = sysConst.DAMAGE_INDEMNITY_STATUS.yes;
        damageCheckDAO.updateDamageCheckIndemnityStatus(params,function(err,result){
            if (err) {
                logger.error(' updateDamageCheckIndemnityStatus ' + err.message);
                throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateDamageCheckIndemnityStatus ' + 'success');
                }else{
                    logger.warn(' updateDamageCheckIndemnityStatus ' + 'failed');
                }
                that();
            }
        })
    }).seq(function(){
        logger.info(' createDamageCheckIndemnity ' + 'success');
        resUtil.resetCreateRes(res,{insertId:indemnityId},null);
        return next();
    })
}

function queryDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.getDamageCheckIndemnity(params,function(error,result){
        if (error) {
            logger.error(' queryDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDamageCheckIndemnity ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateDamageCheckIndemnity(params,function(error,result){
        if (error) {
            logger.error(' updateDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageCheckIndemnity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDamageCheckIndemnityImage(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateDamageCheckIndemnityImage(params,function(error,result){
        if (error) {
            logger.error(' updateDamageCheckIndemnityImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDamageCheckIndemnityImage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.updateIndemnity(params,function(error,result){
        if (error) {
            logger.error(' updateIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateIndemnity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateIndemnityStatus(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        damageCheckIndemnityDAO.updateIndemnityStatus(params,function(error,result){
            if (error) {
                logger.error(' updateIndemnityStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' updateIndemnityStatus ' + 'success');
                    that();
                }else{
                    logger.warn(' updateIndemnityStatus ' + 'failed');
                    resUtil.resetFailedRes(res," 处理结束失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.indemnityDate = myDate;
        damageCheckIndemnityDAO.updateIndemnityFinishTime(params,function(error,result){
            if (error) {
                logger.error(' updateIndemnityDate ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateIndemnityDate ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryIndemnityStatusCount(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.getIndemnityStatusCount(params,function(error,result){
        if (error) {
            logger.error(' queryIndemnityStatusCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryIndemnityStatusCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryIndemnityMonthStat(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.getIndemnityMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryIndemnityMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryIndemnityMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDamageCheckIndemnityCsv(req,res,next){
    var csvString = "";
    var header = "质损编号" + ',' + "打款账号" + ',' + "户名"+ ',' + "开户行" + ','+ "城市" + ','+ "经销商"+ ','+ "计划打款金额" + ','+ "联系人" + ','+ "联系电话"
        + ','+ "申请时间" + ','+ "申请打款备注" + ','+ "申报人"+ ','+ "实际打款金额" + ','+ "打款说明" + ','+ "打款时间" + ','+ "状态" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    damageCheckIndemnityDAO.getDamageCheckIndemnity(params,function(error,rows){
        if (error) {
            logger.error(' queryDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.damageId = rows[i].damage_id;
                parkObj.bankNumber = rows[i].bank_number.replace(/["]/g, '');
                parkObj.bankUserName = rows[i].bank_user_name.replace(/["]/g, '');
                parkObj.bankName = rows[i].bank_name.replace(/["]/g, '');
                parkObj.cityName = rows[i].city_name;
                parkObj.receiveName = rows[i].receive_name;
                parkObj.planMoney = rows[i].plan_money;
                if(rows[i].contacts_name == null){
                    parkObj.contactsName = "";
                }else{
                    parkObj.contactsName = rows[i].contacts_name;
                }
                if(rows[i].tel == null){
                    parkObj.tel = "";
                }else{
                    parkObj.tel = rows[i].tel;
                }
                parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                if(rows[i].apply_explain == null){
                    parkObj.applyExplain = "";
                }else{
                    parkObj.applyExplain = rows[i].apply_explain.replace(/[\r\n]/g, '');
                }
                parkObj.applyUserName = rows[i].apply_user_name;
                if(rows[i].actual_money == null){
                    parkObj.actualMoney = "";
                }else{
                    parkObj.actualMoney = rows[i].actual_money;
                }
                if(rows[i].indemnity_explain == null){
                    parkObj.indemnityExplain = "";
                }else{
                    parkObj.indemnityExplain = rows[i].indemnity_explain.replace(/[\r\n]/g, '');
                }
                if(rows[i].indemnity_date == null){
                    parkObj.indemnityDate = "";
                }else{
                    parkObj.indemnityDate = new Date(rows[i].indemnity_date).toLocaleDateString();
                }
                if(rows[i].indemnity_status == 1){
                    parkObj.indemnityStatus = "未打款";
                }else{
                    parkObj.indemnityStatus = "已打款";
                }
                csvString = csvString+parkObj.damageId+","+parkObj.bankNumber+","+parkObj.bankUserName+"," +parkObj.bankName+","+parkObj.cityName+","
                    +parkObj.receiveName+"," +parkObj.planMoney+"," +parkObj.contactsName+","+parkObj.tel+","+parkObj.createdOn+"," +parkObj.applyExplain+","
                    +parkObj.applyUserName+","+parkObj.actualMoney+","+parkObj.indemnityExplain+","+parkObj.indemnityDate+","+parkObj.indemnityStatus+ '\r\n';
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
    createDamageCheckIndemnity : createDamageCheckIndemnity,
    queryDamageCheckIndemnity : queryDamageCheckIndemnity,
    updateDamageCheckIndemnity : updateDamageCheckIndemnity,
    updateDamageCheckIndemnityImage : updateDamageCheckIndemnityImage,
    updateIndemnity : updateIndemnity,
    updateIndemnityStatus : updateIndemnityStatus,
    queryIndemnityStatusCount : queryIndemnityStatusCount,
    queryIndemnityMonthStat : queryIndemnityMonthStat,
    getDamageCheckIndemnityCsv : getDamageCheckIndemnityCsv
}