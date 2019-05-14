/**
 * Created by zwl on 2017/8/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CityRouteDAO.js');

function addCityRoute(params,callback){
    var query = " insert into city_route_info (route_id,route_start_id,route_start,route_end_id,route_end, " +
        " distance,reverse_money) values ( ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    if(params.routeStartId>params.routeEndId){
        paramsArray[i++] = params.routeEndId+''+params.routeStartId;
    }else{
        paramsArray[i++] = params.routeStartId+''+params.routeEndId;
    }
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.reverseMoney;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCityRoute ');
        return callback(error,rows);
    });
}

function getCityRoute(params,callback) {
    if(params.routeStartId >0 && params.routeEndId >0){
        var query = " select * from city_route_info where route_start_id = " + params.routeStartId + " and route_end_id = " + params.routeEndId +
            " union select * from city_route_info where route_end_id = " + params.routeStartId + " and route_start_id = " + params.routeEndId ;
    }else if(params.routeStartId >0){
        var query = " select * from city_route_info where route_start_id = " + params.routeStartId +
            " union select * from city_route_info where route_end_id = " + params.routeStartId ;
    }else if(params.routeEndId >0){
        var query = " select * from city_route_info where route_end_id = " + params.routeEndId +
            " union select * from city_route_info where route_start_id = " + params.routeEndId ;
    }else{
        var query = " select * from city_route_info where id is not null ";
    }
    var paramsArray=[],i=0;
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

function getCityRouteCheck(params,callback) {
    var query = " select * from city_route_info where route_start_id = " + params.routeStartId + " and route_end_id = " + params.routeEndId +
        " union select * from city_route_info where route_end_id = " + params.routeStartId + " and route_start_id = " + params.routeEndId ;
    var paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCityRouteCheck ');
        return callback(error,rows);
    });
}

function getCityRouteDispatch(params,callback) {
    var query = " select "+ params.routeStartId +" ,ci.id as end_id,ci.city_name,cd.route_id,cd.distance,cd.id from city_info ci left join " +
        " (select cri.route_start_id as start_id, cri.route_end_id as end_id ,cri.route_id,cri.distance,cri.id from city_route_info cri where cri.route_start_id = " + params.routeStartId +
        " union " +
        " select cri2.route_end_id as start_id ,cri2.route_start_id as end_id ,cri2.route_id,cri2.distance,cri2.id from city_route_info cri2 where cri2.route_end_id = " + params.routeStartId +
        " ) as cd on cd.start_id = " + params.routeStartId + " and cd.end_id = ci.id where  cd.distance >= 0 ";
    var paramsArray=[],i=0;
    query = query + '  order by end_id  ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCityRouteDispatch ');
        return callback(error,rows);
    });
}

function updateCityRoute(params,callback){
    var query = " update city_route_info set distance = ? , reverse_money = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.reverseMoney;
    paramsArray[i]=params.routeId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCityRoute ');
        return callback(error,rows);
    });
}
//外部使用接口
function getCityRouteId(params,callback) {
    var query = " select * from city_route_info where route_start = " + "'" + params.routeStart + "'" + " and route_end = " + "'" + params.routeEnd + "'" +
        " union select * from city_route_info where route_end = " + "'" + params.routeStart + "'" + " and route_start = " + "'" + params.routeEnd + "'" ;
    var paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCityRouteId ');
        return callback(error,rows);
    });
}


module.exports ={
    addCityRoute : addCityRoute,
    getCityRoute : getCityRoute,
    getCityRouteBase : getCityRouteBase,
    getCityRouteCheck : getCityRouteCheck,
    getCityRouteDispatch : getCityRouteDispatch,
    updateCityRoute : updateCityRoute,
    getCityRouteId : getCityRouteId
}