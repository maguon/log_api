/**
 * Created by zwl on 2018/6/12.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilDAO = require('../dao/DriveExceedOilDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DriveExceedOil.js');

function createDriveExceedOil(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    driveExceedOilDAO.addDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' createDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveExceedOil ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOil(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOil ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveExceedOilCount(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.getDriveExceedOilCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOil(req,res,next){
    var params = req.params ;
    driveExceedOilDAO.updateDriveExceedOil(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOil ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getDriveExceedOilCsv(req,res,next){
    var csvString = "";
    var header = "超油结算编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "调度编号" + ','+ "计划执行时间"+ ','+ "超油量(L)" + ','+ "超油金额" + ','+ "结算人"
        + ','+ "状态" + ','+ "备注" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveExceedOilDAO.getDriveExceedOil(params,function(error,rows){
        if (error) {
            logger.error(' getDriveExceedOil ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                parkObj.dpRouteTaskId = rows[i].dp_route_task_id;
                if(rows[i].task_plan_date == null){
                    parkObj.taskPlanDate = "";
                }else{
                    parkObj.taskPlanDate = new Date(rows[i].task_plan_date).toLocaleDateString();
                }
                parkObj.exceedOilQuantity = rows[i].exceed_oil_quantity;
                parkObj.exceedOilMoney = rows[i].exceed_oil_money;

                if(rows[i].settle_user_name==null){
                    parkObj.settleUserName = "";
                }else{
                    parkObj.settleUserName = rows[i].settle_user_name;
                }
                if(rows[i].fine_status == 1){
                    parkObj.fineStatus = "未扣";
                }else{
                    parkObj.fineStatus = "已扣";
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }

                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.dpRouteTaskId+","+parkObj.taskPlanDate
                    +","+parkObj.exceedOilQuantity+","+parkObj.exceedOilMoney+","+parkObj.settleUserName +","+parkObj.fineStatus+","+parkObj.remark+ '\r\n';
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
    createDriveExceedOil : createDriveExceedOil,
    queryDriveExceedOil : queryDriveExceedOil,
    queryDriveExceedOilCount : queryDriveExceedOilCount,
    updateDriveExceedOil : updateDriveExceedOil,
    getDriveExceedOilCsv : getDriveExceedOilCsv
}
