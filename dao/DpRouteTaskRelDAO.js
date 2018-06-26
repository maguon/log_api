/**
 * Created by zwl on 2018/6/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskRelDAO.js');

function addDpRouteTaskRel(params,callback){
    var query = " insert into dp_route_task_rel (dp_route_task_id,city_route_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i]=params.cityRouteId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDpRouteTaskRel ');
        return callback(error,rows);
    });
}

function deleteDpRouteTaskRel(params,callback){
    var query = " delete from dp_route_task_rel where dp_route_task_id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and dp_route_task_id = ? ";
    }
    if(params.cityRouteId){
        paramsArray[i++] = params.cityRouteId;
        query = query + " and city_route_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDpRouteTaskRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDpRouteTaskRel : addDpRouteTaskRel,
    deleteDpRouteTaskRel : deleteDpRouteTaskRel
}
