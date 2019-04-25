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
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DrivePeccancy.js');

function createDrivePeccancy(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
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

function queryDrivePeccancyCount(req,res,next){
    var params = req.params ;
    drivePeccancyDAO.getDrivePeccancyCount(params,function(error,result){
        if (error) {
            logger.error(' queryDrivePeccancyCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrivePeccancyCount ' + 'success');
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
    var header = "违章结算编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "货车类型" + ','+ "扣罚分数" + ','+ "买分金额" + ','+ "交通罚款" + ','+
        "罚款金额" + ','+ "个人承担金额" + ','+ "公司承担金额"+ ','+ "违章时间" + ','+ "处理时间"+ ','+ "违章城市"+ ','+ "违章地点" + ','+
        "操作人" + ','+ "状态" + ','+ "备注" ;
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
                if(rows[i].truck_type == 1){
                    parkObj.truckType = "头车";
                }else{
                    parkObj.truckType = "挂车";
                }
                parkObj.fineScore = rows[i].fine_score;
                if(rows[i].buy_score == null){
                    parkObj.buyScore = "";
                }else{
                    parkObj.buyScore = rows[i].buy_score;
                }
                parkObj.trafficFine = rows[i].traffic_fine;
                parkObj.fineMoney = rows[i].fine_money;
                if(rows[i].under_money == null){
                    parkObj.underMoney = "";
                }else{
                    parkObj.underMoney = rows[i].under_money;
                }
                if(rows[i].company_money == null){
                    parkObj.companyMoney = "";
                }else{
                    parkObj.companyMoney = rows[i].company_money;
                }
                if(rows[i].start_date == null){
                    parkObj.startDate = "";
                }else{
                    parkObj.startDate = new Date(rows[i].start_date).toLocaleDateString();
                }
                if(rows[i].handle_date == null){
                    parkObj.handleDate = "";
                }else{
                    parkObj.handleDate = new Date(rows[i].handle_date).toLocaleDateString();
                }
                if(rows[i].city_name == null){
                    parkObj.cityName = "";
                }else{
                    parkObj.cityName = rows[i].city_name;
                }
                if(rows[i].address == null){
                    parkObj.address = "";
                }else{
                    parkObj.address = rows[i].address;
                }
                if(rows[i].op_user_name==null){
                    parkObj.opUserName = "";
                }else{
                    parkObj.opUserName = rows[i].op_user_name;
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

                csvString = csvString+parkObj.id+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.truckType+","+parkObj.fineScore+","+
                    parkObj.buyScore+","+parkObj.trafficFine+","+parkObj.fineMoney +","+parkObj.underMoney +","+parkObj.companyMoney+","+
                    parkObj.startDate +","+parkObj.handleDate+","+ parkObj.cityName+","+parkObj.address+","+parkObj.opUserName +","+
                    parkObj.fineStatus+","+parkObj.remark+ '\r\n';
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
    queryDrivePeccancyCount : queryDrivePeccancyCount,
    updateDrivePeccancy : updateDrivePeccancy,
    getDrivePeccancyCsv : getDrivePeccancyCsv
}
