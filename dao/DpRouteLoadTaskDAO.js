/**
 * Created by zwl on 2017/8/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDAO.js');

function addDpRouteLoadTask(params,callback){
    var query = " insert into dp_route_load_task (user_id,dp_route_task_id,route_start_id,base_addr_id,route_end_id,receive_id,date_id,plan_count) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
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

function getDpRouteLoadTask(params,callback) {
    var query = " select dprl.*,u.real_name,ba.addr_name,c.city_name,r.short_name from dp_route_load_task dprl " +
        " left join user_info u on dprl.user_id = u.uid " +
        " left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id " +
        " left join base_addr ba on dprl.base_addr_id = ba.id " +
        " left join city_info c on dprl.route_end_id = c.id " +
        " left join receive_info r on dprl.receive_id = r.id where dprl.load_task_status > 0 and dprl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprl.dp_route_task_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTask ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadTaskStatus(params,callback){
    var query = " update dp_route_load_task set load_task_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.loadTaskStatus;
    paramsArray[i] = params.dpRouteLoadTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadTaskStatus ');
        return callback(error,rows);
    });
}



module.exports ={
    addDpRouteLoadTask : addDpRouteLoadTask,
    getDpRouteLoadTask : getDpRouteLoadTask,
    updateDpRouteLoadTaskStatus : updateDpRouteLoadTaskStatus
}