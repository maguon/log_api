/**
 * Created by zwl on 2019/5/17.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteTaskFeeDAO = require('../dao/DpRouteTaskFeeDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteTaskFee.js');

function createDpRouteTaskFee(req,res,next){
    var params = req.params ;
    dpRouteTaskFeeDAO.addDpRouteTaskFee(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteTaskFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteTaskFee ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskFee(req,res,next){
    var params = req.params ;
    dpRouteTaskFeeDAO.getDpRouteTaskFee(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskFee ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskFeeCount(req,res,next){
    var params = req.params ;
    dpRouteTaskFeeDAO.getDpRouteTaskFeeCount(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskFeeCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskFeeCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskFee (req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteTaskFeeDAO.getDpRouteTaskFee({dpRouteTaskFeeId:params.dpRouteTaskFeeId},function(error,rows){
            if (error) {
                logger.error(' getDpRouteTaskFee ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0&&rows[0].status != sysConst.TASK_FEE_STATUS.grant){
                    that();
                }else{
                    logger.warn(' getDpRouteTaskFee ' + 'failed');
                    resUtil.resetFailedRes(res," 费用已发放，不能再进行修改 ");
                    return next();
                }
            }
        })
    }).seq(function(){
        dpRouteTaskFeeDAO.updateDpRouteTaskFee(params,function(error,result){
            if (error) {
                logger.error(' updateDpRouteTaskFee ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateDpRouteTaskFee ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateDpRouteTaskFeeStatus (req,res,next){
    var params = req.params;
    if(params.status==sysConst.TASK_FEE_STATUS.grant){
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.grantDate = myDate;
        params.dateId = parseInt(strDate);
    }
    dpRouteTaskFeeDAO.updateDpRouteTaskFeeStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskFeeStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskFeeStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskFeeStatusAll(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    Seq().seq(function(){
        var that = this;
        var dpRouteTaskFeeIds = params.dpRouteTaskFeeIds;
        var rowArray = [] ;
        rowArray.length= dpRouteTaskFeeIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                status : params.status,
                grantDate : myDate,
                dateId : parseInt(strDate),
                dpRouteTaskFeeId : dpRouteTaskFeeIds[i],
                row : i+1,
            }
            dpRouteTaskFeeDAO.updateDpRouteTaskFeeStatus(subParams,function(err,result){
                if (err) {
                    logger.error(' updateDpRouteTaskFeeStatusAll ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.affectedRows>0){
                        logger.info(' updateDpRouteTaskFeeStatusAll  ' + 'success');
                    }else{
                        logger.warn(' updateDpRouteTaskFeeStatusAll  ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' updateDpRouteTaskFeeStatusAll ' + 'success');
        resUtil.resetQueryRes(res,null);
        return next();
    })
}

function queryDpRouteTaskFeeMonthStat(req,res,next){
    var params = req.params ;
    dpRouteTaskFeeDAO.getDpRouteTaskFeeMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskFeeMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskFeeMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDpRouteTaskFeeCsv(req,res,next){
    var csvString = "";
    var header = "司机" + ',' +"货车牌号" + ',' + "商品车加油费" + ',' + "货车停留天数" + ','+ "货车停车单价" + ','+"货车停车费" + ','+
        "商品车停留天数"+ ','+ "商品车停车单价" + ','+ "商品车停车费"+ ','+ "其他费用" + ','+"申请时间" + ','+
        "银行账号" + ','+ "户名"+ ','+ "开户行"+ ','+"状态"+ ','+"备注"+ ','+ "调度编号"+ ','+"起始城市"+ ','+"目的城市";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskFeeDAO.getDpRouteTaskFee(params,function(error,rows){
        if (error) {
            logger.error(' getDpRouteTaskFee ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                if(rows[i].drive_name == null){
                    parkObj.driveName = "";
                }else{
                    parkObj.driveName = rows[i].drive_name;
                }
                if(rows[i].truck_num == null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                if(rows[i].car_oil_fee == null){
                    parkObj.carOilFee = "";
                }else{
                    parkObj.carOilFee = rows[i].car_oil_fee;
                }
                if(rows[i].day_count == null){
                    parkObj.dayCount = "";
                }else{
                    parkObj.dayCount = rows[i].day_count;
                }
                if(rows[i].single_price == null){
                    parkObj.singlePrice = "";
                }else{
                    parkObj.singlePrice = rows[i].single_price;
                }
                if(rows[i].total_price == null){
                    parkObj.totalPrice = "";
                }else{
                    parkObj.totalPrice = rows[i].total_price;
                }
                if(rows[i].car_day_count == null){
                    parkObj.carDayCount = "";
                }else{
                    parkObj.carDayCount = rows[i].car_day_count;
                }
                if(rows[i].car_single_price == null){
                    parkObj.carSinglePrice = "";
                }else{
                    parkObj.carSinglePrice = rows[i].car_single_price;
                }
                if(rows[i].car_total_price == null){
                    parkObj.carTotalPrice = "";
                }else{
                    parkObj.carTotalPrice = rows[i].car_total_price;
                }
                if(rows[i].other_fee == null){
                    parkObj.otherFee = "";
                }else{
                    parkObj.otherFee = rows[i].other_fee;
                }
                if(rows[i].created_on == null){
                    parkObj.createdOn = "";
                }else{
                    parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                }
                if(rows[i].bank_number==null){
                    parkObj.bankNumber = "";
                }else{
                    parkObj.bankNumber = rows[i].bank_number;
                }
                if(rows[i].bank_name==null){
                    parkObj.bankName = "";
                }else{
                    parkObj.bankName = rows[i].bank_name;
                }
                if(rows[i].bank_user_name==null){
                    parkObj.bankUserName = "";
                }else{
                    parkObj.bankUserName = rows[i].bank_user_name;
                }
                if(rows[i].status == 1){
                    parkObj.status = "未发放";
                }else if(rows[i].status == 2){
                    parkObj.status = "已发放";
                }else{
                    parkObj.status = "驳回";
                }
                if(rows[i].remark==null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                if(rows[i].dp_route_task_id==null){
                    parkObj.dpRouteTaskId = "";
                }else{
                    parkObj.dpRouteTaskId = rows[i].dp_route_task_id;
                }
                if(rows[i].route_start==null){
                    parkObj.routeStart = "";
                }else{
                    parkObj.routeStart = rows[i].route_start;
                }
                if(rows[i].route_end==null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                csvString = csvString+parkObj.driveName+","+parkObj.truckNum+","+parkObj.carOilFee+","+parkObj.dayCount+","+
                    parkObj.singlePrice+","+parkObj.totalPrice+","+parkObj.carDayCount+","+parkObj.carSinglePrice+","+
                    parkObj.carTotalPrice+","+parkObj.otherFee+","+parkObj.createdOn+","+parkObj.bankNumber+","+parkObj.bankName+","+
                    parkObj.bankUserName+","+parkObj.status+","+parkObj.remark+","+
                parkObj.dpRouteTaskId+","+parkObj.routeStart+","+parkObj.routeEnd+ '\r\n';
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
    createDpRouteTaskFee : createDpRouteTaskFee,
    queryDpRouteTaskFee : queryDpRouteTaskFee,
    queryDpRouteTaskFeeCount : queryDpRouteTaskFeeCount,
    updateDpRouteTaskFee : updateDpRouteTaskFee,
    updateDpRouteTaskFeeStatus : updateDpRouteTaskFeeStatus,
    updateDpRouteTaskFeeStatusAll : updateDpRouteTaskFeeStatusAll,
    queryDpRouteTaskFeeMonthStat : queryDpRouteTaskFeeMonthStat,
    getDpRouteTaskFeeCsv : getDpRouteTaskFeeCsv
}