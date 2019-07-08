/**
 * Created by zwl on 2019/7/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterTruckDAO.js');

function addSettleOuterTruck(params,callback){
    var query = " insert into settle_outer_truck (make_id,make_name," +
        " route_start_id,route_start,route_end_id,route_end,distance,fee) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.fee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleOuterTruck ');
        return callback(error,rows);
    });
}

function getSettleOuterTruck(params,callback) {
    var query = " select sot.* from settle_outer_truck sot " +
        " where sot.id is not null ";
    var paramsArray=[],i=0;
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and sot.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and sot.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and sot.route_end_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterTruck ');
        return callback(error,rows);
    });
}

function updateSettleOuterTruck(params,callback){
    var query = " update settle_outer_truck set distance = ? , fee = ? " +
        " where make_id = ? and route_start_id = ? and route_end_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateSettleOuterTruck ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleOuterTruck : addSettleOuterTruck,
    getSettleOuterTruck : getSettleOuterTruck,
    updateSettleOuterTruck : updateSettleOuterTruck
}
