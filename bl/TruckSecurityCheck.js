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
    var header = "货车牌号" + ',' + "货车类型" + ',' + "司机" + ','+ "转向" + ','+ "转向备注" + ','+ "制动" + ','+ "制动备注" + ','+ "液压" + ','+ "液压备注"
        + ','+ "照明" + ','+ "照明备注" + ','+ "传动"+ ','+ "传动备注" + ','+ "轮胎" + ','+ "轮胎备注" + ','+ "悬挂" + ','+ "悬挂备注" + ','+ "车身"
        + ','+ "车身备注" + ','+ "随车安全设施" + ','+ "随车安全设施备注" + ','+ "连接" + ','+ "连接备注" + ','+ "检查时间" + ','+ "检查结论及建议" + ','+ "检查员";
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
                if(rows[i].drive_name == null){
                    parkObj.driveName = "";
                }else{
                    parkObj.driveName = rows[i].drive_name;
                }
                if(rows[i].turn == 0){
                    parkObj.turn = "";
                }else if(rows[i].turn == 1){
                    parkObj.turn = "未检";
                }else if(rows[i].turn == 2){
                    parkObj.turn = "不合格";
                }else if(rows[i].turn == 3){
                    parkObj.turn = "合格";
                }else{
                    parkObj.turn = "复检合格";
                }
                if(rows[i].turn_remark == null){
                    parkObj.turnRemark = "";
                }else{
                    parkObj.turnRemark = rows[i].turn_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].braking == 0){
                    parkObj.braking = "";
                }else if(rows[i].braking == 1){
                    parkObj.braking = "未检";
                }else if(rows[i].braking == 2){
                    parkObj.braking = "不合格";
                }else if(rows[i].braking == 3){
                    parkObj.braking = "合格";
                }else{
                    parkObj.braking = "复检合格";
                }
                if(rows[i].braking_remark == null){
                    parkObj.brakingRemark = "";
                }else{
                    parkObj.brakingRemark = rows[i].braking_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].liquid == 0){
                    parkObj.liquid = "";
                }else if(rows[i].liquid == 1){
                    parkObj.liquid = "未检";
                }else if(rows[i].liquid == 2){
                    parkObj.liquid = "不合格";
                }else if(rows[i].liquid == 3){
                    parkObj.liquid = "合格";
                }else{
                    parkObj.liquid = "复检合格";
                }
                if(rows[i].liquid_remark == null){
                    parkObj.liquidRemark = "";
                }else{
                    parkObj.liquidRemark = rows[i].liquid_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].lighting == 0){
                    parkObj.lighting = "";
                }else if(rows[i].lighting == 1){
                    parkObj.lighting = "未检";
                }else if(rows[i].lighting == 2){
                    parkObj.lighting = "不合格";
                }else if(rows[i].lighting == 3){
                    parkObj.lighting = "合格";
                }else{
                    parkObj.lighting = "复检合格";
                }
                if(rows[i].lighting_remark == null){
                    parkObj.lightingRemark = "";
                }else{
                    parkObj.lightingRemark = rows[i].lighting_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].transmission == 0){
                    parkObj.transmission = "";
                }else if(rows[i].transmission == 1){
                    parkObj.transmission = "未检";
                }else if(rows[i].transmission == 2){
                    parkObj.transmission = "不合格";
                }else if(rows[i].transmission == 3){
                    parkObj.transmission = "合格";
                }else{
                    parkObj.transmission = "复检合格";
                }
                if(rows[i].transmission_remark == null){
                    parkObj.transmissionRemark = "";
                }else{
                    parkObj.transmissionRemark = rows[i].transmission_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].tyre == 0){
                    parkObj.tyre = "";
                }else if(rows[i].tyre == 1){
                    parkObj.tyre = "未检";
                }else if(rows[i].tyre == 2){
                    parkObj.tyre = "不合格";
                }else if(rows[i].tyre == 3){
                    parkObj.tyre = "合格";
                }else{
                    parkObj.tyre = "复检合格";
                }
                if(rows[i].tyre_remark == null){
                    parkObj.tyreRemark = "";
                }else{
                    parkObj.tyreRemark = rows[i].tyre_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].suspension == 0){
                    parkObj.suspension = "";
                }else if(rows[i].suspension == 1){
                    parkObj.suspension = "未检";
                }else if(rows[i].suspension == 2){
                    parkObj.suspension = "不合格";
                }else if(rows[i].suspension == 3){
                    parkObj.suspension = "合格";
                }else{
                    parkObj.suspension = "复检合格";
                }
                if(rows[i].suspension_remark == null){
                    parkObj.suspensionRemark = "";
                }else{
                    parkObj.suspensionRemark = rows[i].suspension_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].structure == 0){
                    parkObj.structure = "";
                }else if(rows[i].structure == 1){
                    parkObj.structure = "未检";
                }else if(rows[i].structure == 2){
                    parkObj.structure = "不合格";
                }else if(rows[i].structure == 3){
                    parkObj.structure = "合格";
                }else{
                    parkObj.structure = "复检合格";
                }
                if(rows[i].structure_remark == null){
                    parkObj.structureRemark = "";
                }else{
                    parkObj.structureRemark = rows[i].structure_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].facilities == 0){
                    parkObj.facilities = "";
                }else if(rows[i].facilities == 1){
                    parkObj.facilities = "未检";
                }else if(rows[i].facilities == 2){
                    parkObj.facilities = "不合格";
                }else if(rows[i].facilities == 3){
                    parkObj.facilities = "合格";
                }else{
                    parkObj.facilities = "复检合格";
                }
                if(rows[i].facilities_remark == null){
                    parkObj.facilitiesRemark = "";
                }else{
                    parkObj.facilitiesRemark = rows[i].facilities_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].link_device == 0){
                    parkObj.linkDevice = "";
                }else if(rows[i].link_device == 1){
                    parkObj.linkDevice = "未检";
                }else if(rows[i].link_device == 2){
                    parkObj.linkDevice = "不合格";
                }else if(rows[i].link_device == 3){
                    parkObj.linkDevice = "合格";
                }else{
                    parkObj.linkDevice = "复检合格";
                }
                if(rows[i].link_device_remark == null){
                    parkObj.linkDeviceRemark = "";
                }else{
                    parkObj.linkDeviceRemark = rows[i].link_device_remark.replace(/[\r\n]/g, '');
                }

                if(rows[i].check_date == null){
                    parkObj.checkDate = "";
                }else{
                    parkObj.checkDate = new Date(rows[i].check_date).toLocaleDateString();
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark.replace(/[\r\n]/g, '');
                }
                if(rows[i].check_user_name == null){
                    parkObj.checkUserName = "";
                }else{
                    parkObj.checkUserName = rows[i].check_user_name;
                }

                csvString = csvString+parkObj.truckNum+","+parkObj.truckType+","+parkObj.driveName+","+parkObj.turn+","+parkObj.turnRemark+","+parkObj.braking+","+parkObj.brakingRemark
                    +","+parkObj.liquid+","+parkObj.liquidRemark+","+parkObj.lighting+","+parkObj.lightingRemark+","+parkObj.transmission +","+parkObj.transmissionRemark
                +","+parkObj.tyre+","+parkObj.tyreRemark+","+parkObj.suspension+","+parkObj.suspensionRemark+","+parkObj.structure +","+parkObj.structureRemark
                +","+parkObj.facilities+","+parkObj.facilitiesRemark+","+parkObj.linkDevice+","+parkObj.linkDeviceRemark+","+parkObj.checkDate +","+parkObj.remark+","+parkObj.checkUserName+ '\r\n';
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