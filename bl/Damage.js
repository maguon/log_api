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


module.exports = {
    createDamage : createDamage,
    queryDamage : queryDamage,
    queryDamageCheckCount : queryDamageCheckCount,
    updateDamage : updateDamage
}