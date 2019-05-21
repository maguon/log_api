/**
 * Created by zwl on 2019/5/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDepreciationDAO.js');

function addTruckDepreciation(params,callback){
    var query = "insert into truck_depreciation (drive_id,drive_name,truck_id,truck_num,y_month,depreciation_fee) " +
        " values ( ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.yMonth;
    paramsArray[i++]=params.depreciationFee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addTruckDepreciation ');
        return callback(error,rows);
    })
}

function getTruckDepreciation(params,callback) {
    var query = " select td.* from truck_depreciation td " +
        " where td.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckDepreciationId){
        paramsArray[i++] = params.truckDepreciationId;
        query = query + " and td.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and td.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and td.truck_id = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and td.y_month = ? ";
    }
    query = query + ' order by td.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckDepreciation ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckDepreciation : addTruckDepreciation,
    getTruckDepreciation : getTruckDepreciation
}