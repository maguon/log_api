/**
 * Created by zwl on 2017/8/23.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskDetailDAO.js');

function addDpRouteLoadTaskDetail(params,callback){
    var query = " insert into dp_route_load_task_detail (dp_route_load_task_id,car_id,vin) values ( ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteLoadTaskId;
    paramsArray[i++]=params.carId;
    paramsArray[i]=params.vin;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteLoadTaskDetail ');
        return callback(error,rows);
    });
}

function getDpRouteLoadTaskDetail(params,callback) {
    var query = " select dpdtl.*,c.make_id,c.make_name,dprl.load_task_status from dp_route_load_task_detail dpdtl " +
        " left join dp_route_load_task dprl on dpdtl.dp_route_load_task_id = dprl.id " +
        " left join car_info c on dpdtl.car_id = c.id where dprl.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskDetailId){
        paramsArray[i++] = params.dpRouteTaskDetailId;
        query = query + " and dpdtl.id = ? ";
    }
    if(params.dpRouteLoadTaskId){
        paramsArray[i++] = params.dpRouteLoadTaskId;
        query = query + " and dpdtl.dp_route_load_task_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and dpdtl.vin = ? ";
    }
    if(params.carLoadStatus){
        paramsArray[i++] = params.carLoadStatus;
        query = query + " and dpdtl.car_load_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRouteLoadTaskDetail ');
        return callback(error,rows);
    });
}

function updateDpRouteLoadTaskDetailStatus(params,callback){
    var query = " update dp_route_load_task_detail set car_load_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.carLoadStatus;
    paramsArray[i] = params.dpRouteTaskDetailId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDpRouteLoadTaskDetailStatus ');
        return callback(error,rows);
    });
}

function deleteDpRouteLoadTaskDetail(params,callback){
    var query = " delete from dp_route_load_task_detail where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i] = params.dpRouteTaskDetailId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteLoadTaskDetail ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteLoadTaskDetail : addDpRouteLoadTaskDetail,
    getDpRouteLoadTaskDetail : getDpRouteLoadTaskDetail,
    updateDpRouteLoadTaskDetailStatus : updateDpRouteLoadTaskDetailStatus,
    deleteDpRouteLoadTaskDetail : deleteDpRouteLoadTaskDetail
}