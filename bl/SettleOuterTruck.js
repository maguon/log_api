/**
 * Created by zwl on 2019/7/8.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleOuterTruckDAO = require('../dao/SettleOuterTruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterTruck.js');

function createSettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.addSettleOuterTruck(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "此数据已存在，操作失败");
                return next();
            } else{
                logger.error(' createSettleOuterTruck ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createSettleOuterTruck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function querySettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.getSettleOuterTruck(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterTruck ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function querySettleOuterTruckList(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.getSettleOuterTruckList(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterTruckList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterTruckList ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function querySettleOuterTruckCarCount(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.getSettleOuterTruckCarCount(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterTruckCarCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterTruckCarCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateSettleOuterTruck(req,res,next){
    var params = req.params ;
    settleOuterTruckDAO.updateSettleOuterTruck(params,function(error,result){
        if (error) {
            logger.error(' updateSettleOuterTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateSettleOuterTruck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getSettleOuterTruckCsv(req,res,next){
    var csvString = "";
    var header = "VIN"+ ',' +"品牌"+ ',' +"外协公司"+ ',' +"司机"+ ',' +"货车牌号"+ ',' +"委托方"+ ','+"始发城市"+ ','+"装车地点"+ ','+"目的城市"+ ','+
        "经销商"+ ','+"指令时间"+ ','+"公里数(公里)"+ ','+"价格/公里"+ ','+"金额";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    var fees = 0;
    settleOuterTruckDAO.getSettleOuterTruckList(params,function(error,rows){
        if (error) {
            logger.error(' getSettleOuterTruckList ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                parkObj.makeName = rows[i].make_name;
                parkObj.companyName = rows[i].company_name;
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].e_short_name == null){
                    parkObj.eShortName = "";
                }else{
                    parkObj.eShortName = rows[i].e_short_name;
                }
                parkObj.routeStart = rows[i].route_start;
                parkObj.addrName = rows[i].addr_name;
                parkObj.routeEnd = rows[i].route_end;
                if(rows[i].r_short_name == null){
                    parkObj.rShortName = "";
                }else{
                    parkObj.rShortName = rows[i].r_short_name;
                }
                if(rows[i].order_date == null){
                    parkObj.orderDate = "";
                }else{
                    parkObj.orderDate = new Date(rows[i].order_date).toLocaleDateString();
                }
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                if(rows[i].fee == null){
                    parkObj.fee = "";
                }else{
                    parkObj.fee = rows[i].fee;
                }
                fees = rows[i].distance*rows[i].fee;
                if(fees == 0){
                    parkObj.fees = "";
                }else{
                    parkObj.fees = fees;
                }
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.companyName+","+parkObj.driveName+","+parkObj.truckNum+","+
                    parkObj.eShortName+","+parkObj.routeStart+","+parkObj.addrName+","+parkObj.routeEnd+","+parkObj.rShortName+","+parkObj.orderDate+","+
                    parkObj.distance+","+parkObj.fee+","+parkObj.fees+'\r\n';
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
    createSettleOuterTruck : createSettleOuterTruck,
    querySettleOuterTruck : querySettleOuterTruck,
    querySettleOuterTruckList : querySettleOuterTruckList,
    querySettleOuterTruckCarCount : querySettleOuterTruckCarCount,
    updateSettleOuterTruck : updateSettleOuterTruck,
    getSettleOuterTruckCsv : getSettleOuterTruckCsv
}
