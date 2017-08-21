/**
 * Created by zwl on 2017/8/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DispatchTruckRelDAO.js');

function addDispatchTruckRel(params,callback){
    var query = " insert into dispatch_truck_rel (truck_id,drive_id,city_route_id,base_addr_id,route_end_id,distance,task_start_date) " +
        " values ( ? , ? , ? , ? , ? ,? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.cityRouteId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.taskStartDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDispatchTruckRel ');
        return callback(error,rows);
    });
}

function getDispatchTruckRel(params,callback) {
    var query = " select dtr.*,c.city_name as city_route_start,ce.city_name as city_route_end from dispatch_truck_rel dtr " +
        " left join city_info c on dtr.city_route_id = c.id " +
        " left join city_info ce on dtr.route_end_id = ce.id where dtr.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and dtr.id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDispatchTruckRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDispatchTruckRel : addDispatchTruckRel,
    getDispatchTruckRel : getDispatchTruckRel
}