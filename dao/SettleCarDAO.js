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

function getSettleCar(params,callback) {
    var query = " select sc.*,e.short_name,c.route_start,c.route_end from settle_car sc " +
        " left join car_info c on sc.vin = c.vin and sc.entrust_id = c.entrust_id " +
        " and sc.route_start_id = c.route_start_id and sc.route_end_id = c.route_end_id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " where sc.id is not null ";
    var paramsArray=[],i=0;
    if(params.settleCarId){
        paramsArray[i++] = params.settleCarId;
        query = query + " and sc.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and sc.vin = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and sc.entrust_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and sc.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and sc.route_end_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleCar ');
        return callback(error,rows);
    });
}

function updateSettleCar(params,callback){
    var query = " update settle_car set vin = ? , entrust_id = ? , route_start_id = ? , route_end_id = ? , price = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.settleCarId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateSettleCar ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleCar : addSettleCar,
    getSettleCar : getSettleCar,
    updateSettleCar : updateSettleCar
}

