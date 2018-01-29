/**
 * Created by zwl on 2018/1/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskCleanRelDAO.js');

function addDpRouteLoadTaskCleanRel(params,callback){
    var query = " insert into dp_route_load_task_clean_rel (dp_route_task_id,dp_route_load_task_id," +
        " drive_id,truck_id,receive_id,single_price,total_price,car_count) values ( ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.dpRouteLoadTaskId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.singlePrice;
    paramsArray[i++]=params.totalPrice;
    paramsArray[i]=params.carCount;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTaskCleanRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTaskCleanRel : addDpRouteLoadTaskCleanRel
}