/**
 * Created by zwl on 2017/10/31.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var qualityDAO = require('../dao/QualityDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('Quality.js');

function createQuality(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    qualityDAO.addQuality(params,function(error,result){
        if (error) {
            logger.error(' createQuality ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createQuality ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryQuality(req,res,next){
    var params = req.params;
    qualityDAO.getQuality(params,function(error,result){
        if (error) {
            logger.error(' queryQuality ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryQuality ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateQuality(req,res,next){
    var params = req.params ;
    Seq().seq(function(){
        var that = this;
        qualityDAO.getQuality({qualityId:params.qualityId},function(error,rows){
            if (error) {
                logger.error(' getQuality ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].quality_status == sysConst.QUALITY_STATUS.ready_process){
                    that();
                }else{
                    logger.warn(' getQuality ' + 'failed');
                    resUtil.resetFailedRes(res," 非待处理状态，不能进行修改 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        qualityDAO.updateQuality(params,function(error,result){
            if (error) {
                logger.error(' updateQuality ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateQuality ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createQuality : createQuality,
    queryQuality : queryQuality,
    updateQuality : updateQuality
}