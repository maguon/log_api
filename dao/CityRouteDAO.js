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
    var query = " select cr.*,c.city_name as route_start,ce.city_name as route_end from city_route_info cr " +
        " left join city_info c on cr.route_start_id = c.id " +
        " left join city_info ce on cr.route_end_id = ce.id where cr.id is not null ";
    var paramsArray=[],i=0;
    if(params.routeId){
        paramsArray[i++] = params.routeId;
        query = query + " and cr.id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and cr.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and cr.route_end_id = ? ";
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
    var query = " select cri.route_start_id start_id, cri.route_end_id as end_id ,cri.distance from city_route_info cri where cri.route_start_id = " + params.routeStartId+
        " union " +
        " select cri2.route_end_id start_id ,cri2.route_start_id as end_id ,cri2.distance from city_route_info cri2 where cri2.route_end_id = " + params.routeStartId+
        " union " +
        " select " + params.routeStartId + " ,ci.id as end_id , null from city_info ci ";
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