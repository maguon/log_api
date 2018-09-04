/**
 * Created by zwl on 2018/8/27.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustCityRouteRelDAO.js');

function addEntrustCityRouteRel(params,callback){
    var query = " insert into entrust_city_route_rel (entrust_id,city_route_id,make_id,make_name,distance,fee)  values ( ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.cityRouteId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.fee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrustCityRouteRel ');
        return callback(error,rows);
    });
}

function getEntrustCityRouteRel(params,callback) {
    if(params.routeStartId >0 && params.routeEndId >0){
        var query = " select ecrr.*,cr.route_start_id,cr.route_start,cr.route_end_id,cr.route_end,e.short_name " +
            " from entrust_city_route_rel ecrr " +
            " inner join (select * from city_route_info where route_start_id = " + params.routeStartId + " and route_end_id = " + params.routeEndId +
            " union select * from city_route_info where route_end_id = " + params.routeStartId + " and route_start_id = " + params.routeEndId +")  cr on ecrr.city_route_id = cr.id " +
            " left join entrust_info e on ecrr.entrust_id = e.id " +
            " where ecrr.entrust_id is not null ";
    }else if(params.routeStartId >0){
        var query = " select ecrr.*,cr.route_start_id,cr.route_start,cr.route_end_id,cr.route_end,e.short_name " +
            " from entrust_city_route_rel ecrr " +
            " inner join (select * from city_route_info where route_start_id = " + params.routeStartId +
            " union select * from city_route_info where route_end_id = " + params.routeStartId +")  cr on ecrr.city_route_id = cr.id " +
            " left join entrust_info e on ecrr.entrust_id = e.id " +
            " where ecrr.entrust_id is not null ";
    }else {
        var query = " select ecrr.*,cr.route_start_id,cr.route_start,cr.route_end_id,cr.route_end,e.short_name " +
            " from entrust_city_route_rel ecrr " +
            " left join city_route_info cr on ecrr.city_route_id = cr.id " +
            " left join entrust_info e on ecrr.entrust_id = e.id " +
            " where ecrr.entrust_id is not null ";
    }
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
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustCityRouteRel ');
        return callback(error,rows);
    });
}

function updateEntrustCityRouteRel(params,callback){
    var query = " update entrust_city_route_rel set distance = ? , fee = ? where entrust_id = ? and city_route_id = ? and make_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.fee;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.cityRouteId;
    paramsArray[i]=params.makeId;
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
