/**
 * Created by zwl on 2018/6/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleHandoverDAO = require('../dao/SettleHandoverDAO.js');
var settleSeqDAO = require('../dao/SettleSeqDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('SettleHandover.js');

function createSettleHandover(req,res,next){
    var params = req.params ;
    var settleHandoverId = 0;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMM');
    var yMonth = 0;
    var seqId = 0;
    Seq().seq(function(){
        var that = this;
        settleSeqDAO.getSettleSeq(params,function(error,rows){
            if (error) {
                logger.error(' getSettleSeq ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0&&rows[0].y_month == strDate){
                    yMonth = rows[0].y_month;
                    seqId = rows[0].seq_id +1;
                }else{
                    yMonth = parseInt(strDate);
                    seqId =parseInt(strDate +"00001");
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        params.yMonth =yMonth;
        params.seqId =seqId;
        settleSeqDAO.addSettleSeq(params,function(error,result){
            if (error) {
                logger.error(' createSettleSeq ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createSettleSeq ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res," 序列生成失败 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        params.number = seqId;
        settleHandoverDAO.addSettleHandover(params,function(error,result){
            if (error) {
                logger.error(' createSettleHandover ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createSettleHandover ' + 'success');
                    settleHandoverId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res," 交接单生成失败 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        logger.info(' createSettleHandover ' + 'success');
        resUtil.resetQueryRes(res,{settleHandoverId:settleHandoverId},null);
        return next();
    })
}

function querySettleHandover(req,res,next){
    var params = req.params ;
    settleHandoverDAO.getSettleHandover(params,function(error,result){
        if (error) {
            logger.error(' querySettleHandover ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleHandover ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createSettleHandover : createSettleHandover,
    querySettleHandover : querySettleHandover
}
