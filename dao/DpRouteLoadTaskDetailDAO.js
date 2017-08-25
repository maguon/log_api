/**
 * Created by zwl on 2017/8/23.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDetailDAO.js');

function getDpRouteLoadTaskDetail(params,callback) {
    var query = " select dpdtl.*,dpdtl.vin,c.make_id,c.make_name from dp_route_load_task_detail dpdtl " +
        " left join dp_route_load_task dprl on dpdtl.dp_route_load_task_id = dprl.id " +
        " left join car_info c on dpdtl.car_id = c.id where dprl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dpdtl.dp_route_load_task_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskDetail ');
        return callback(error,rows);
    });
}


module.exports ={
    getDpRouteLoadTaskDetail : getDpRouteLoadTaskDetail
}