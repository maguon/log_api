/**
 * Created by zwl on 2018/8/27.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustCityRouteRelDAO.js');

function addEntrustCityRouteRel(params,callback){
    var query = " insert into entrust_city_route_rel (entrust_id,city_route_id,make_id,make_name," +
        " route_start_id,route_end_id,size_type,distance,fee) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.cityRouteId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.sizeType;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.fee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrustCityRouteRel ');
        return callback(error,rows);
    });
}

function getEntrustCityRouteRel(params,callback) {
    var query = " select ecrr.*,c.city_name as route_start,ci.city_name as route_end,e.short_name " +
        " from entrust_city_route_rel ecrr " +
        " left join city_info c on ecrr.route_start_id = c.id " +
        " left join city_info ci on ecrr.route_end_id = ci.id " +
        " left join entrust_info e on ecrr.entrust_id = e.id " +
        " where ecrr.entrust_id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and e.id = ? ";
    }
    if(params.cityRouteId){
        paramsArray[i++] = params.cityRouteId;
        query = query + " and ecrr.city_route_id = ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and ecrr.make_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustCityRouteRel ');
        return callback(error,rows);
    });
}

function updateEntrustCityRouteRel(params,callback){
    var query = " update entrust_city_route_rel set distance = ? , fee = ? " +
        " where entrust_id = ? and make_id = ? and route_start_id = ? and route_end_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrustCityRouteRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addEntrustCityRouteRel : addEntrustCityRouteRel,
    getEntrustCityRouteRel : getEntrustCityRouteRel,
    updateEntrustCityRouteRel : updateEntrustCityRouteRel
}
