/**
 * Created by zwl on 2017/8/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDAO.js');

function addDpRouteLoadTask(params,callback){
    var query = " insert into dp_route_load_task (user_id,demand_id,dp_route_task_id,route_start_id,base_addr_id,route_end_id,receive_id,date_id,plan_count) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.dpDemandId;
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
    var query = " select dprl.*,u.real_name as task_op_name,u1.real_name as field_op_name,ba.addr_name,c.city_name,r.short_name,dpd.pre_count, " +
        " dpr.task_plan_date,dpr.task_start_date,dpr.date_id as task_end_date,t.truck_num,d.drive_name,d.tel,count(dpdtl.id) as car_count, " +
        " count(case when cer.exception_status = 1 then cer.id end) as car_exception_count " +
        " from dp_route_load_task dprl " +
        " left join dp_demand_info dpd on dprl.demand_id = dpd.id " +
        " left join user_info u on dprl.user_id = u.uid " +
        " left join user_info u1 on dprl.field_op_id = u1.uid " +
        " left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id " +
        " left join dp_route_load_task_detail dpdtl on dprl.id = dpdtl.dp_route_load_task_id " +
        " left join car_exception_rel cer on dpdtl.car_id = cer.car_id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join base_addr ba on dprl.base_addr_id = ba.id " +
        " left join city_info c on dprl.route_end_id = c.id " +
        " left join receive_info r on dprl.receive_id = r.id " +
        " where dprl.load_task_status !=8 and dprl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprl.dp_route_task_id = ? ";
    }
    if(params.dpDemandId){
        paramsArray[i++] = params.dpDemandId;
        query = query + " and dprl.demand_id = ? ";
    }
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dprl.id = ? ";
    }
    query = query + ' group by dprl.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTask ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskBase(params,callback) {
    var query = " select dprl.*,dpr.task_status from dp_route_load_task dprl " +
        " left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id where dprl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dprl.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprl.dp_route_task_id = ? ";
    }
    if(params.loadTaskStatus){
        paramsArray[i++] = params.loadTaskStatus;
        query = query + " and dprl.load_task_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskBase ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadTaskStatus(params,callback){
    if(params.loadTaskStatus == 3){
        var query = " update dp_route_load_task set field_op_id = ? , load_task_status = ? where  id = ? ";
    }else{
        var query = " update dp_route_load_task set load_task_status = ? where  id = ? ";
    }
    var paramsArray=[],i=0;
    if(params.loadTaskStatus == 3){
        paramsArray[i++] = params.userId;
    }
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
    getDpRouteLoadTaskBase : getDpRouteLoadTaskBase,
    updateDpRouteLoadTaskStatus : updateDpRouteLoadTaskStatus
}
