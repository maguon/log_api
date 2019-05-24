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
        var receivedDate = moment(params.receivedDate).format('YYYYMMDD');
        params.dateId = parseInt(receivedDate);
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

function queryNotSettleHandover(req,res,next){
    var params = req.params ;
    settleHandoverDAO.getNotSettleHandover(params,function(error,result){
        if (error) {
            logger.error(' queryNotSettleHandover ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryNotSettleHandover ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryNotSettleHandoverCarCount(req,res,next){
    var params = req.params ;
    settleHandoverDAO.getNotSettleHandoverCarCount(params,function(error,result){
        if (error) {
            logger.error(' queryNotSettleHandoverCarCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryNotSettleHandoverCarCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function querySettleHandoverDayCount(req,res,next){
    var params = req.params ;
    settleHandoverDAO.getSettleHandoverDayCount(params,function(error,result){
        if (error) {
            logger.error(' querySettleHandoverDayCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleHandoverDayCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function querySettleHandoverMonthCount(req,res,next){
    var params = req.params ;
    settleHandoverDAO.getSettleHandoverMonthCount(params,function(error,result){
        if (error) {
            logger.error(' querySettleHandoverMonthCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleHandoverMonthCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSettle(req,res,next){
    var params = req.params ;
    if(params.dateIdStart !=null || params.dateIdStart !=""){
        var dateIdStart = params.dateIdStart;
        var d = new Date(dateIdStart);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdStart = parseInt(currentDateStr);
    }
    if(params.dateIdEnd !=null || params.dateIdEnd !=""){
        var dateIdEnd = params.dateIdEnd;
        var d = new Date(dateIdEnd);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateIdEnd = parseInt(currentDateStr);
    }
    settleHandoverDAO.getDriveSettle(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSettle ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSettle ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveCost(req,res,next){
    var params = req.params ;
    settleHandoverDAO.getDriveCost(params,function(error,result){
        if (error) {
            logger.error(' queryDriveCost ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveCost ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateSettleHandover(req,res,next){
    var params = req.params ;
    var receivedDate = moment(params.receivedDate).format('YYYYMMDD');
    params.dateId = parseInt(receivedDate);
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

function updateHandoveImage(req,res,next){
    var params = req.params ;
    settleHandoverDAO.updateHandoveImage(params,function(error,result){
        if (error) {
            logger.error(' updateHandoveImage ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateHandoveImage ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getSettleHandoverCsv(req,res,next){
    var csvString = "";
    var header = "交接单编号" + ',' + "委托方" + ',' + "起始城市" + ','+ "目的城市" + ','+ "经销商"+ ','+ "交接车辆VIN" + ','+ "序号" + ',' +"交接单收到日期" + ','+ "提交人"+','+ "备注" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    settleHandoverDAO.getSettleHandoverBase(params,function(error,rows){
        if (error) {
            logger.error(' getSettleHandoverBase ' + error.message);
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
                if(rows[i].vin == null){
                    parkObj.vin = "";
                }else{
                    parkObj.vin = rows[i].vin;
                }
                if(rows[i].serial_number == null){
                    parkObj.serialNumber = "";
                }else{
                    parkObj.serialNumber = rows[i].serial_number;
                }
                if(rows[i].received_date == null){
                    parkObj.receivedDate = "";
                }else{
                    parkObj.receivedDate = new Date(rows[i].received_date).toLocaleDateString();
                }
                if(rows[i].op_user_name == null){
                    parkObj.opUserName = "";
                }else{
                    parkObj.opUserName = rows[i].op_user_name;
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                csvString = csvString+parkObj.number+","+parkObj.shortName+","+parkObj.cityRouteStart+","+parkObj.cityRouteEnd
                    +","+parkObj.rShortName+","+parkObj.vin+","+parkObj.serialNumber+","+parkObj.receivedDate+","+parkObj.opUserName+","+parkObj.remark+ '\r\n';
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

function getNotSettleHandoverCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "品牌" + ',' + "委托方" + ','+ "调度编号" + ','+ "起始城市"+ ','+ "目的城市" + ','+ "经销商"
        + ',' +"司机" + ','+ "货车车牌"+','+ "计划执行时间" + ',' +"送达时间";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    settleHandoverDAO.getNotSettleHandover(params,function(error,rows){
        if (error) {
            logger.error(' getNotSettleHandover ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                if(rows[i].make_name == null){
                    parkObj.makeName = "";
                }else{
                    parkObj.makeName = rows[i].make_name;
                }
                if(rows[i].e_short_name == null){
                    parkObj.eShortName = "";
                }else{
                    parkObj.eShortName = rows[i].e_short_name;
                }
                if(rows[i].dp_route_task_id == null){
                    parkObj.dpRouteTaskId = "";
                }else{
                    parkObj.dpRouteTaskId = rows[i].dp_route_task_id;
                }
                if(rows[i].route_start == null){
                    parkObj.routeStart = "";
                }else{
                    parkObj.routeStart = rows[i].route_start;
                }
                if(rows[i].route_end == null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                if(rows[i].r_short_name == null){
                    parkObj.rShortName = "";
                }else{
                    parkObj.rShortName = rows[i].r_short_name;
                }
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
                if(rows[i].task_plan_date == null){
                    parkObj.taskPlanDate = "";
                }else{
                    parkObj.taskPlanDate = new Date(rows[i].task_plan_date).toLocaleDateString();
                }
                if(rows[i].arrive_date == null){
                    parkObj.arriveDate = "";
                }else{
                    parkObj.arriveDate = new Date(rows[i].arrive_date).toLocaleDateString();
                }
                csvString = csvString+parkObj.vin+","+parkObj.makeName+","+parkObj.eShortName+","+parkObj.dpRouteTaskId +","+parkObj.routeStart
                    +","+parkObj.routeEnd+","+parkObj.rShortName+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.taskPlanDate+","+parkObj.arriveDate+ '\r\n';
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

function getDriveSettleCsv(req,res,next){
    var csvString = "";
    var header = "司机" + ',' + "货车牌号" + ',' + "所属类型" + ','+ "所属公司" + ','+ "商品车到库数"+ ','+ "商品车非到库数" + ','+
        "里程工资"+ ','+ "倒板工资"+ ','+ "产值" ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    settleHandoverDAO.getDriveSettle(params,function(error,rows){
        if (error) {
            logger.error(' getDriveSettle ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else if(rows[i].operate_type == 2){
                    parkObj.operateType = "外协";
                }else if(rows[i].operate_type == 3){
                    parkObj.operateType = "供方";
                }else{
                    parkObj.operateType = "承包";
                }
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                if(rows[i].storage_car_count == null){
                    parkObj.storageCarCount = "";
                }else{
                    parkObj.storageCarCount = rows[i].storage_car_count;
                }
                if(rows[i].not_storage_car_count == null){
                    parkObj.notStorageCarCount = "";
                }else{
                    parkObj.notStorageCarCount = rows[i].not_storage_car_count;
                }
                if(rows[i].distance_salary == null){
                    parkObj.distanceSalary = "";
                }else{
                    parkObj.distanceSalary = rows[i].distance_salary;
                }
                if(rows[i].reverse_salary == null){
                    parkObj.reverseSalary = "";
                }else{
                    parkObj.reverseSalary = rows[i].reverse_salary;
                }
                if(rows[i].output == null){
                    parkObj.output = "";
                }else{
                    parkObj.output = rows[i].output;
                }
                csvString = csvString+parkObj.driveName+","+parkObj.truckNum+","+parkObj.operateType+","+parkObj.companyName+","+
                    parkObj.storageCarCount+","+parkObj.notStorageCarCount +","+parkObj.distanceSalary+","+parkObj.reverseSalary+","+
                    parkObj.output+ '\r\n';
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

function getDriveCostCsv(req,res,next){
    var csvString = "";
    var header = "司机" + ',' + "洗车费" + ',' + "门卫费" + ','+ "过路费"+ ','+ "燃料费"+ ','+ "保道费" + ','+ "罚款费"+ ','+"停车费"+ ','+
        "打车费" + ','+ "住宿费"+ ','+ "商品车费用" + ','+ "进门费"+ ','+ "地跑费"+ ','+ "拖车费" + ','+ "维修配件费"+ ','+ "保养费" + ','+ "货车维修费";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    settleHandoverDAO.getDriveCost(params,function(error,rows){
        if (error) {
            logger.error(' getDriveCost ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].actual_price == null){
                    parkObj.actualPrice = "";
                }else{
                    parkObj.actualPrice = rows[i].actual_price;
                }
                if(rows[i].actual_guard_fee == null){
                    parkObj.actualGuardFee = "";
                }else{
                    parkObj.actualGuardFee = rows[i].actual_guard_fee;
                }
                if(rows[i].refund_passing_cost == null){
                    parkObj.refundPassingCost = "";
                }else{
                    parkObj.refundPassingCost = rows[i].refund_passing_cost;
                }
                if(rows[i].refund_fuel_cost == null){
                    parkObj.refundFuelCost = "";
                }else{
                    parkObj.refundFuelCost = rows[i].refund_fuel_cost;
                }
                if(rows[i].refund_protect_cost == null){
                    parkObj.refundProtectCost = "";
                }else{
                    parkObj.refundProtectCost = rows[i].refund_protect_cost;
                }
                if(rows[i].refund_penalty_cost == null){
                    parkObj.refundPenaltyCost = "";
                }else{
                    parkObj.refundPenaltyCost = rows[i].refund_penalty_cost;
                }
                if(rows[i].refund_parking_cost == null){
                    parkObj.refundParkingCost = "";
                }else{
                    parkObj.refundParkingCost = rows[i].refund_parking_cost;
                }
                if(rows[i].refund_taxi_cost == null){
                    parkObj.refundTaxiCost = "";
                }else{
                    parkObj.refundTaxiCost = rows[i].refund_taxi_cost;
                }
                if(rows[i].refund_hotel_cost == null){
                    parkObj.refundHotelCost = "";
                }else{
                    parkObj.refundHotelCost = rows[i].refund_hotel_cost;
                }
                if(rows[i].refund_car_cost == null){
                    parkObj.refundCarCost = "";
                }else{
                    parkObj.refundCarCost = rows[i].refund_car_cost;
                }
                if(rows[i].refund_enter_cost == null){
                    parkObj.refundEnterCost = "";
                }else{
                    parkObj.refundEnterCost = rows[i].refund_enter_cost;
                }
                if(rows[i].refund_run_cost == null){
                    parkObj.refundRunCost = "";
                }else{
                    parkObj.refundRunCost = rows[i].refund_run_cost;
                }
                if(rows[i].refund_trailer_cost == null){
                    parkObj.refundTrailerCost = "";
                }else{
                    parkObj.refundTrailerCost = rows[i].refund_trailer_cost;
                }
                if(rows[i].refund_repair_cost == null){
                    parkObj.refundRepairCost = "";
                }else{
                    parkObj.refundRepairCost = rows[i].refund_repair_cost;
                }
                if(rows[i].refund_care_cost == null){
                    parkObj.refundCareCost = "";
                }else{
                    parkObj.refundCareCost = rows[i].refund_care_cost;
                }
                if(rows[i].repair_money == null){
                    parkObj.repairMoney = "";
                }else{
                    parkObj.repairMoney = rows[i].repair_money;
                }
                csvString = csvString+parkObj.driveName+","+parkObj.actualPrice+","+parkObj.actualGuardFee
                    +","+parkObj.refundPassingCost+","+parkObj.refundFuelCost+","+parkObj.refundProtectCost +","+parkObj.refundPenaltyCost
                    +","+parkObj.refundParkingCost+","+parkObj.refundTaxiCost+","+parkObj.refundHotelCost+","+parkObj.refundCarCost
                    +","+parkObj.refundEnterCost+","+parkObj.refundRunCost+","+parkObj.refundTrailerCost+","+parkObj.refundRepairCost
                    +","+parkObj.refundCareCost+","+parkObj.repairMoney+ '\r\n';
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
    queryNotSettleHandover : queryNotSettleHandover,
    queryNotSettleHandoverCarCount : queryNotSettleHandoverCarCount,
    querySettleHandoverDayCount : querySettleHandoverDayCount,
    querySettleHandoverMonthCount : querySettleHandoverMonthCount,
    queryDriveSettle : queryDriveSettle,
    queryDriveCost : queryDriveCost,
    updateSettleHandover : updateSettleHandover,
    updateHandoveImage : updateHandoveImage,
    getSettleHandoverCsv : getSettleHandoverCsv,
    getNotSettleHandoverCsv : getNotSettleHandoverCsv,
    getDriveSettleCsv : getDriveSettleCsv,
    getDriveCostCsv : getDriveCostCsv
}
