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

function updateSettleHandover(req,res,next){
    var params = req.params ;
    settleHandoverDAO.updateSettleHandover(params,function(error,result){
        if (error) {
            logger.error(' updateSettleHandover ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateSettleHandover ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getSettleHandoverCsv(req,res,next){
    var csvString = "";
    var header = "交接单编号" + ',' + "委托方" + ',' + "起始城市" + ','+ "目的城市" + ','+ "经销商"+ ','+ "交接车辆" + ','+ "交接单收到日期" + ','+ "提交人"+','+ "备注" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    settleHandoverDAO.getSettleHandover(params,function(error,rows){
        if (error) {
            logger.error(' getTruckRepairRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.number = rows[i].number;
                parkObj.shortName = rows[i].short_name;
                if(rows[i].city_route_start == null){
                    parkObj.cityRouteStart = "";
                }else{
                    parkObj.cityRouteStart = rows[i].city_route_start;
                }
                if(rows[i].city_route_end == null){
                    parkObj.cityRouteEnd = "";
                }else{
                    parkObj.cityRouteEnd = rows[i].city_route_end;
                }
                if(rows[i].r_short_name == null){
                    parkObj.rShortName = "";
                }else{
                    parkObj.rShortName = rows[i].r_short_name;
                }
                parkObj.carCount = rows[i].car_count;
                if(rows[i].received_date == null){
                    parkObj.receivedDate = "";
                }else{
                    parkObj.receivedDate = new Date(rows[i].received_date).toLocaleDateString();
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                if(rows[i].op_user_name == null){
                    parkObj.opUserName = "";
                }else{
                    parkObj.opUserName = rows[i].op_user_name;
                }
                csvString = csvString+parkObj.number+","+parkObj.shortName+","+parkObj.cityRouteStart+","+parkObj.cityRouteEnd
                    +","+parkObj.rShortName+","+parkObj.carCount+","+parkObj.receivedDate+","+parkObj.remark+","+parkObj.opUserName+ '\r\n';
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
    createSettleHandover : createSettleHandover,
    querySettleHandover : querySettleHandover,
    updateSettleHandover : updateSettleHandover,
    getSettleHandoverCsv : getSettleHandoverCsv
}
