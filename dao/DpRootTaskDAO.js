/**
 * Created by zwl on 2017/8/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRootTaskDAO.js');

function addDpRootTask(params,callback){
    var query = " insert into dp_root_task (truck_id,drive_id,route_start_id,route_end_id,distance,task_start_date) " +
        " values ( ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.taskStartDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRootTask ');
        return callback(error,rows);
    });
}

function getDpRootTask(params,callback) {
    var query = " select dpr.*,c.city_name as city_route_start,ce.city_name as city_route_end from dp_root_task dpr " +
        " left join city_info c on dpr.route_start_id = c.id " +
        " left join city_info ce on dpr.route_end_id = ce.id where dpr.id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRootTaskId){
        paramsArray[i++] = params.dpRootTaskId;
        query = query + " and dpr.id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDpRootTask ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRootTask : addDpRootTask,
    getDpRootTask : getDpRootTask
}