/**
 * Created by zwl on 2017/8/21.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DispatchTruckDAO.js');

function addDispatchTruck(params,callback){
    var query = " insert into dispatch_truck_info (route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,pre_count,plan_count,order_date) " +
        " values ( ? , ? , ? , ? , ? ,? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.preCount;
    paramsArray[i++]=params.planCount;
    paramsArray[i]=params.orderDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDispatchTruck ');
        return callback(error,rows);
    });
}

function getDispatchTruck(params,callback) {
    var query = " select sum(dt.pre_count) as pre_count,sum(dt.plan_count) as plan_count, " +
        " dt.route_start_id,dt.route_start,dt.route_end_id,dt.route_end,dt.order_date from dispatch_truck_info dt where dt.id is not null ";
    var paramsArray=[],i=0;
    if(params.dispatchId){
        paramsArray[i++] = params.dispatchId;
        query = query + " and dt.id = ? ";
    }
    query = query + ' group by dt.route_start_id,dt.route_start,dt.route_end_id,dt.route_end,dt.order_date ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDispatchTruck ');
        return callback(error,rows);
    });
}


module.exports ={
    addDispatchTruck : addDispatchTruck,
    getDispatchTruck : getDispatchTruck
}