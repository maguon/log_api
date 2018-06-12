/**
 * Created by zwl on 2018/6/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var drivePeccancyDAO = require('../dao/DrivePeccancyDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DrivePeccancy.js');

function createDrivePeccancy(req,res,next){
    var params = req.params ;
    drivePeccancyDAO.addDrivePeccancy(params,function(error,result){
        if (error) {
            logger.error(' createDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDrivePeccancy ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDrivePeccancy(req,res,next){
    var params = req.params ;
    drivePeccancyDAO.getDrivePeccancy(params,function(error,result){
        if (error) {
            logger.error(' queryDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrivePeccancy ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDrivePeccancy(req,res,next){
    var params = req.params ;
    drivePeccancyDAO.updateDrivePeccancy(params,function(error,result){
        if (error) {
            logger.error(' updateDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDrivePeccancy ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getDrivePeccancyCsv(req,res,next){
    var csvString = "";
    var header = "违章结算编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "扣罚分数" + ','+ "罚款金额"+ ','+ "时间范围(始)" + ','+ "时间范围(终)" + ','+ "结算人"
        + ','+ "状态" + ','+ "备注" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    drivePeccancyDAO.getDrivePeccancy(params,function(error,rows){
        if (error) {
            logger.error(' getDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.id = rows[i].id;
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                parkObj.fineScore = rows[i].fine_score;
                parkObj.fineMoney = rows[i].fine_money;
                if(rows[i].start_date == null){
                    parkObj.startDate = "";
                }else{
                    parkObj.startDate = new Date(rows[i].start_date).toLocaleDateString();
                }
                if(rows[i].end_date == null){
                    parkObj.endDate = "";
                }else{
                    parkObj.endDate = new Date(rows[i].end_date).toLocaleDateString();
                }
                parkObj.settleUserName = rows[i].settle_user_name;
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

                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.fineScore+","+parkObj.fineMoney
                    +","+parkObj.startDate+","+parkObj.endDate+","+parkObj.settleUserName +","+parkObj.fineStatus+","+parkObj.remark+ '\r\n';
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
    createDrivePeccancy : createDrivePeccancy,
    queryDrivePeccancy : queryDrivePeccancy,
    updateDrivePeccancy : updateDrivePeccancy,
    getDrivePeccancyCsv : getDrivePeccancyCsv
}