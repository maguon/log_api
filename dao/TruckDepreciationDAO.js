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


module.exports ={
    addTruckDepreciation : addTruckDepreciation
}