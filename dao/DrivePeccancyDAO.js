/**
 * Created by zwl on 2018/6/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DrivePeccancyDAO.js');

function addDrivePeccancy(params,callback){
    var query = " insert into drive_peccancy (drive_id,truck_id,fine_score,fine_money,start_date,end_date,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.fineScore;
    paramsArray[i++]=params.fineMoney;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDrivePeccancy ');
        return callback(error,rows);
    });
}


module.exports ={
    addDrivePeccancy : addDrivePeccancy
}