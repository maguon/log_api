/**
 * Created by zwl on 2018/11/19.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskTmpDAO.js');

function addDpRouteTaskTmp(params,callback){
    var query = " insert into dp_route_task_tmp (user_id,truck_id,drive_id,route_id,route_start_id,route_start,route_end_id,route_end, " +
        " distance,task_plan_date,truck_number) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    if(params.routeStartId>params.routeEndId){
        paramsArray[i++] = params.routeEndId+''+params.routeStartId;
    }else{
        paramsArray[i++] = params.routeStartId+''+params.routeEndId;
    }
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.taskPlanDate;
    paramsArray[i]=params.truckNumber;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskTmp ');
        return callback(error,rows);
    });
}

function getDpRouteTaskTmp(params,callback) {
    var query = " select dprtmp.*,dprtmp.route_start as city_route_start,dprtmp.route_end as city_route_end " +
        " from dp_route_task_tmp dprtmp " +
        " where dprtmp.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskTmpId){
        paramsArray[i++] = params.dpRouteTaskTmpId;
        query = query + " and dprtmp.id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dprtmp.truck_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dprtmp.drive_id = ? ";
    }
    query = query + " order by dprtmp.id desc";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteTaskTmp ');
        return callback(error,rows);
    });
}

function deleteDpRouteTaskTmp(params,callback){
    var query = " delete from dp_route_task_tmp where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.dpRouteTaskTmpId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteTaskTmp ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTaskTmp : addDpRouteTaskTmp,
    getDpRouteTaskTmp : getDpRouteTaskTmp,
    deleteDpRouteTaskTmp : deleteDpRouteTaskTmp
}