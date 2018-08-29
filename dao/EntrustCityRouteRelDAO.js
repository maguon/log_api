/**
 * Created by zwl on 2018/8/27.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustCityRouteRelDAO.js');

function addEntrustCityRouteRel(params,callback){
    var query = " insert into entrust_city_route_rel (entrust_id,city_route_id,distance,fee)  values ( ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.cityRouteId;
    paramsArray[i++]=params.distance;
    paramsArray[i]=params.fee;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrustCityRouteRel ');
        return callback(error,rows);
    });
}

function getEntrustCityRouteRel(params,callback) {
    var query = " select ecrr.*,cr.route_start_id,cr.route_start,cr.route_end_id,cr.route_end,e.short_name " +
        " from entrust_city_route_rel ecrr " +
        " left join city_route_info cr on ecrr.city_route_id = cr.id " +
        " left join entrust_info e on ecrr.entrust_id = e.id " +
        " where ecrr.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and ecrr.id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and e.id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and cr.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and cr.route_end_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustCityRouteRel ');
        return callback(error,rows);
    });
}

function updateEntrustCityRouteRel(params,callback){
    var query = " update entrust_city_route_rel set distance = ? , fee = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.distance;
    paramsArray[i++]=params.fee;
    paramsArray[i]=params.relId;
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
