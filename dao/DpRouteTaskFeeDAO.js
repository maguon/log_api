/**
 * Created by zwl on 2019/5/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskFeeDAO.js');

function addDpRouteTaskFee(params,callback){
    var query = " insert into dp_route_task_fee (drive_id,drive_name," +
        " truck_id,truck_num,day_count,single_price,total_price) " +
        " values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.dayCount;
    paramsArray[i++]=params.singlePrice;
    paramsArray[i++]=params.totalPrice;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskFee ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTaskFee : addDpRouteTaskFee
}