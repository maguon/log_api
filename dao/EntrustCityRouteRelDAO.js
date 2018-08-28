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


module.exports ={
    addEntrustCityRouteRel : addEntrustCityRouteRel
}
