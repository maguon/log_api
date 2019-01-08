/**
 * Created by zwl on 2019/1/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckSecurityCheckDAO = require('../dao/TruckSecurityCheckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckSecurityCheck.js');

function createTruckSecurityCheck(req,res,next){
    var params = req.params ;
    truckSecurityCheckDAO.addTruckSecurityCheck(params,function(error,result){
        if (error) {
            logger.error(' createTruckSecurityCheck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruckSecurityCheck ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryTruckSecurityCheck(req,res,next){
    var params = req.params ;
    truckSecurityCheckDAO.getTruckSecurityCheck(params,function(error,result){
        if (error) {
            logger.error(' queryTruckSecurityCheck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckSecurityCheck ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateTruckSecurityCheck(req,res,next){
    var params = req.params ;
    truckSecurityCheckDAO.updateTruckSecurityCheck(params,function(error,result){
        if (error) {
            logger.error(' updateTruckSecurityCheck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckSecurityCheck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getTruckSecurityCheckCsv(req,res,next){
    var csvString = "";
    var header = "货车牌号" + ',' + "货车类型" + ',' + "转向" + ','+ "制动" + ','+ "照明" + ','+ "传动" + ','+ "轮胎"
        + ','+ "车身结构" + ','+ "随车安全设施(灭火器、危险安全牌)" + ','+ "主挂连接装置"+ ','+ "检查时间" + ','+ "备注" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    truckSecurityCheckDAO.getTruckSecurityCheck(params,function(error,rows){
        if (error) {
            logger.error(' getTruckSecurityCheckCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].truck_type == 1){
                    parkObj.truckType = "头车";
                }else{
                    parkObj.truckType = "挂车";
                }
                if(rows[i].turn == 0){
                    parkObj.turn = "";
                }else{
                    parkObj.turn = "检了";
                }
                if(rows[i].braking == 0){
                    parkObj.braking = "";
                }else{
                    parkObj.braking = "检了";
                }
                if(rows[i].lighting == 0){
                    parkObj.lighting = "";
                }else{
                    parkObj.lighting = "检了";
                }
                if(rows[i].transmission == 0){
                    parkObj.transmission = "";
                }else{
                    parkObj.transmission = "检了";
                }
                if(rows[i].tyre == 0){
                    parkObj.tyre = "";
                }else{
                    parkObj.tyre = "检了";
                }
                if(rows[i].structure == 0){
                    parkObj.structure = "";
                }else{
                    parkObj.structure = "检了";
                }
                if(rows[i].facilities == 0){
                    parkObj.facilities = "";
                }else{
                    parkObj.facilities = "检了";
                }
                if(rows[i].link_device == 0){
                    parkObj.linkDevice = "";
                }else{
                    parkObj.linkDevice = "检了";
                }
                if(rows[i].check_date == null){
                    parkObj.checkDate = "";
                }else{
                    parkObj.checkDate = new Date(rows[i].check_date).toLocaleDateString();
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }

                csvString = csvString+parkObj.truckNum+","+parkObj.truckType+","+parkObj.turn+","+parkObj.braking+","+parkObj.lighting
                    +","+parkObj.transmission+","+parkObj.tyre+","+parkObj.structure+","+parkObj.facilities+","+parkObj.linkDevice +","+parkObj.checkDate+","+parkObj.remark+ '\r\n';
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
    createTruckSecurityCheck : createTruckSecurityCheck,
    queryTruckSecurityCheck : queryTruckSecurityCheck,
    updateTruckSecurityCheck : updateTruckSecurityCheck,
    getTruckSecurityCheckCsv : getTruckSecurityCheckCsv
}