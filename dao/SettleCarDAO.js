/**
 * Created by zwl on 2018/9/25.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleCarDAO.js');

function addSettleCar(params,callback){
    var query = " insert into settle_car (vin,entrust_id,route_start_id,route_end_id,price,user_id) " +
        " values ( ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleCar ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleCar : addSettleCar
}

