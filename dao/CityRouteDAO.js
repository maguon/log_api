/**
 * Created by zwl on 2017/8/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CityRouteDAO.js');

function addCityRoute(params,callback){
    var query = " insert into city_route_info (route_start_id,route_end_id,km) values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i]=params.km;
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

function updateCityRoute(params,callback){
    var query = " update city_route_info set km = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.km;
    paramsArray[i]=params.routeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCityRoute ');
        return callback(error,rows);
    });
}


module.exports ={
    addCityRoute : addCityRoute,
    getCityRoute : getCityRoute,
    updateCityRoute : updateCityRoute
}