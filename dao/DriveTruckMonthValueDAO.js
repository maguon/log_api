/**
 * Created by zwl on 2019/5/29.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveTruckMonthValueDAO.js');

function getDriveTruckMonthValue(params,callback) {
    var query = " select dtmv.* from drive_truck_month_value dtmv " +
        " where dtmv.id is not null ";
    var paramsArray=[],i=0;
    if(params.valueId){
        paramsArray[i++] = params.valueId;
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
    var query = " update drive_truck_month_value set depreciation_fee = ? where truck_id = ? and y_month = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.depreciationFee;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.yMonth;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDepreciationFee ');
        return callback(error,rows);
    });
}


module.exports ={
    getDriveTruckMonthValue : getDriveTruckMonthValue,
    updateTruckDepreciationFee : updateTruckDepreciationFee
}