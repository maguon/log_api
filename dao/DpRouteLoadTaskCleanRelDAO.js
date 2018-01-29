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

function getDpRouteLoadTaskCleanRel(params,callback) {
    var query = " select dpcr.*,d.drive_name,t.truck_num,u.real_name as field_op_name,dprl.load_date,ci.city_name as route_end_name, " +
        " r.short_name,u1.real_name as grant_user_name from dp_route_load_task_clean_rel dpcr " +
        " left join drive_info d on dpcr.drive_id = d.id " +
        " left join truck_info t on dpcr.truck_id = t.id " +
        " left join receive_info r on dpcr.receive_id = r.id " +
        " left join dp_route_load_task dprl on dpcr.dp_route_load_task_id = dprl.id " +
        " left join user_info u on dprl.field_op_id = u.uid " +
        " left join user_info u1 on dpcr.grant_user_id = u1.uid " +
        " left join city_info ci on dprl.route_end_id = ci.id where dpcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.loadTaskCleanRelId){
        paramsArray[i++] = params.loadTaskCleanRelId;
        query = query + " and dpcr.id = ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dprl.dp_route_task_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dpcr.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and dprl.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and dpcr.receive_id = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and dpcr.status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and dpcr.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and dpcr.created_on <= ? ";
    }
    query = query + ' group by dpcr.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskCleanRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTaskCleanRel : addDpRouteLoadTaskCleanRel,
    getDpRouteLoadTaskCleanRel : getDpRouteLoadTaskCleanRel
}