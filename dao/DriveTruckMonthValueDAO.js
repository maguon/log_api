/**
 * Created by zwl on 2019/5/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveTruckMonthValueDAO.js');

function addDistance(params,callback){
    var query = " insert into drive_truck_month_value" +
        " (y_month,drive_id,truck_id,reverse_count,load_distance,no_load_distance,distance," +
        " load_oil_distance,no_oil_distance,receive_car_count,storage_car_count) " +
        " select "+params.yMonth+",dpr.drive_id,dpr.truck_id, " +
        " count(case when dpr.reverse_flag = 1 then dpr.id end) as reverse_count, " +
        " sum(case when dpr.load_flag = 1 then dpr.distance end) as load_distance, " +
        " sum(case when dpr.load_flag = 0 then dpr.distance end) as no_load_distance, " +
        " sum(dpr.distance) as distance, " +
        " sum(case when dpr.oil_load_flag = 1 then dpr.oil_distance end) as load_oil_distance, " +
        " sum(case when dpr.oil_load_flag = 0 then dpr.oil_distance end) as no_oil_distance, " +
        " sum( case when dprl.receive_flag=0 and dprl.transfer_flag=0 then dpr.car_count end) not_storage_car_count, " +
        " sum( case when dprl.receive_flag=1 or dprl.transfer_flag=1 then dpr.car_count end) storage_car_count " +
        " from dp_route_task dpr " +
        " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id " +
        " where dpr.task_status >=9 and dpr.task_plan_date>="+params.yMonth+"01 and dpr.task_plan_date<=" +params.yMonth+"31"+
        " group by dpr.drive_id,dpr.truck_id ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDistance ');
        return callback(error,rows);
    });
}

function getDriveTruckMonthValue(params,callback) {
    var query = " select dtmv.* from drive_truck_month_value dtmv " +
        " where dtmv.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveTruckMonthValueId){
        paramsArray[i++] = params.driveTruckMonthValueId;
        query = query + " and dtmv.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dtmv.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dtmv.truck_id = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and dtmv.y_month = ? ";
    }
    query = query + ' order by dtmv.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveTruckMonthValue ');
        return callback(error,rows);
    });
}

function updateTruckDepreciationFee(params,callback){
    var query = " update drive_truck_month_value set depreciation_fee = ? where id is not null" ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.depreciationFee;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and truck_id = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and y_month = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDepreciationFee ');
        return callback(error,rows);
    });
}

function updateDepreciationFee(params,callback){
    var query = " update drive_truck_month_value set insure_fee = ? , depreciation_fee = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureFee;
    paramsArray[i++]=params.depreciationFee;
    paramsArray[i++]=params.driveTruckMonthValueId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDepreciationFee ');
        return callback(error,rows);
    });
}


module.exports ={
    addDistance : addDistance,
    getDriveTruckMonthValue : getDriveTruckMonthValue,
    updateTruckDepreciationFee : updateTruckDepreciationFee,
    updateDepreciationFee : updateDepreciationFee
}