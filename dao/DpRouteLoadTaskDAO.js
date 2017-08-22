/**
 * Created by zwl on 2017/8/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDAO.js');

function addDpRouteLoadTask(params,callback){
    var query = " insert into dp_route_load_task (dp_route_task_id,route_start_id,base_addr_id,route_end_id,receive_id,date_id,plan_count) " +
        " values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.planCount;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTask ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTask : addDpRouteLoadTask
}
