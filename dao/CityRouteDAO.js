/**
 * Created by zwl on 2017/8/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CityRouteDAO.js');

function addCityRoute(params,callback){
    var query = " insert into city_route_info (route_start_id,route_end_id,distance) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i]=params.distance;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCityRoute ');
        return callback(error,rows);
    });
}

function getCityRoute(params,callback) {
    var query = " select * from city_route_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.routeId){
        paramsArray[i++] = params.routeId;
        query = query + " and id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and route_end_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCityRoute ');
        return callback(error,rows);
    });
}

function getCityRouteBase(params,callback) {
    var query = " select "+ params.routeStartId +" ,ci.id as end_id,ci.city_name,cd.distance from city_info ci left join " +
        " (select cri.route_start_id as start_id, cri.route_end_id as end_id ,cri.distance from city_route_info cri where cri.route_start_id = " + params.routeStartId +
        " union " +
        " select cri2.route_end_id as start_id ,cri2.route_start_id as end_id ,cri2.distance from city_route_info cri2 where cri2.route_end_id = " + params.routeStartId +
        " ) as cd on cd.start_id = " + params.routeStartId + " and cd.end_id = ci.id ";
    var paramsArray=[],i=0;
    query = query + '  order by end_id  ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCityRouteBase ');
        return callback(error,rows);
    });
}

function updateCityRoute(params,callback){
    var query = " update city_route_info set distance = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.routeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCityRoute ');
        return callback(error,rows);
    });
}


module.exports ={
    addCityRoute : addCityRoute,
    getCityRoute : getCityRoute,
    getCityRouteBase : getCityRouteBase,
    updateCityRoute : updateCityRoute
}