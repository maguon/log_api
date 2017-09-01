/**
 * Created by zwl on 2017/8/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskDAO.js');

function addDpRouteTask(params,callback){
    var query = " insert into dp_route_task (user_id,truck_id,drive_id,route_start_id,route_end_id,distance,task_plan_date) " +
        " values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.taskPlanDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTask ');
        return callback(error,rows);
    });
}

function getDpRouteTask(params,callback) {
    if(params.taskStatus ==null || params.taskStatus ==""){
        var query = " select dpr.*,u.real_name as route_op_name,t.truck_num,tl.number as trail_number,d.drive_name,d.tel," +
            " c.city_name as city_route_start,ce.city_name as city_route_end from dp_route_task dpr " +
            " left join user_info u on dpr.user_id = u.uid " +
            " left join city_info c on dpr.route_start_id = c.id " +
            " left join city_info ce on dpr.route_end_id = ce.id " +
            " left join truck_info t on dpr.truck_id = t.id " +
            " left join truck_info tl on t.rel_id = tl.id " +
            " left join drive_info d on dpr.drive_id = d.id " +
            " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id " +
            " left join dp_route_load_task_detail dpdtl on dprl.id = dpdtl.dp_route_load_task_id " +
            " where dpr.id is not null ";
    }else{
        var query = " select dpr.*,u.real_name as route_op_name,t.truck_num,tl.number as trail_number,d.drive_name,d.tel," +
            " c.city_name as city_route_start,ce.city_name as city_route_end from dp_route_task dpr " +
            " left join user_info u on dpr.user_id = u.uid " +
            " left join city_info c on dpr.route_start_id = c.id " +
            " left join city_info ce on dpr.route_end_id = ce.id " +
            " left join truck_info t on dpr.truck_id = t.id " +
            " left join truck_info tl on t.rel_id = tl.id " +
            " left join drive_info d on dpr.drive_id = d.id " +
            " left join dp_route_load_task dprl on dpr.id = dprl.dp_route_task_id " +
            " left join dp_route_load_task_detail dpdtl on dprl.id = dpdtl.dp_route_load_task_id " +
            " where dpr.task_status in ("+ params.taskStatus +") and dpr.id is not null ";
    }
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dpr.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and dpdtl.vin = ? ";
    }
    if(params.taskPlanDateStart){
        paramsArray[i++] = params.taskPlanDateStart +" 00:00:00";
        query = query + " and dpr.task_plan_date >= ? ";
    }
    if(params.taskPlanDateEnd){
        paramsArray[i++] = params.taskPlanDateEnd +" 23:59:59";
        query = query + " and dpr.task_plan_date <= ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and dpr.route_start_id = ? ";
    }
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and dprl.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dpr.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dprl.receive_id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dpr.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dpr.date_id <= ? ";
    }
    if(params.loadDistance){
        paramsArray[i++] = params.loadDistance;
        query = query + " and dpr.car_count > ? ";
    }
    if(params.noLoadDistance){
        paramsArray[i++] = params.noLoadDistance;
        query = query + " and dpr.car_count <= ? ";
    }
    query = query + ' group by dpr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTask ');
        return callback(error,rows);
    });
}

function getDriveDistanceCount(params,callback) {
    var query = " select d.id as drive_id,d.drive_name,d.tel,dpr.truck_id,t.truck_num, " +
        " count(case when dpr.task_status = " + params.taskStatus + " then dpr.id end) as complete_count, " +
        " sum(case when dpr.car_count > " + params.loadDistance + " then dpr.distance end) as load_distance, " +
        " sum(case when dpr.car_count <= " + params.noLoadDistance + " then dpr.distance end) as no_load_distance, " +
        " td.dispatch_flag,td.current_city,td.task_start,td.task_end " +
        " from dp_route_task dpr " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join truck_dispatch td on dpr.truck_id = td.truck_id " +
        " where dpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dpr.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dpr.date_id <= ? ";
    }
    query = query + ' group by d.id,dpr.truck_id,td.dispatch_flag,td.current_city,td.task_start,td.task_end ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveDistanceCount ');
        return callback(error,rows);
    });
}

function updateDpRouteTaskStatus(params,callback){
    var query = " update dp_route_task set task_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.taskStatus;
    paramsArray[i] = params.dpRouteTaskId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteTaskStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTask : addDpRouteTask,
    getDpRouteTask : getDpRouteTask,
    getDriveDistanceCount : getDriveDistanceCount,
    updateDpRouteTaskStatus : updateDpRouteTaskStatus
}