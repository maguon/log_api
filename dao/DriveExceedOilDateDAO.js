/**
 * Created by zwl on 2019/5/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDateDAO.js');

function addDriveExceedOilDate(params,callback){
    var query = " insert into drive_exceed_oil_date (month_date_id,drive_id,truck_id) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.monthDateId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveExceedOilDate ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveExceedOilDate : addDriveExceedOilDate
}
