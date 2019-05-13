/**
 * Created by zwl on 2019/5/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarMatchDAO.js');

function addCarMatch(params,callback){
    var query = " insert into car_match (vin,make_id,make_name)  values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarMatch ');
        return callback(error,rows);
    });
}

function getCarMatch(params,callback) {
    var query = " select * from car_match where id is not null ";
    var paramsArray=[],i=0;
    if(params.carMatchId){
        paramsArray[i++] = params.carMatchId;
        query = query + " and id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and vin = ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and make_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarMatch ');
        return callback(error,rows);
    });
}

function updateCarMatch(params,callback){
    var query = " update car_match set vin = ? , make_id = ? , make_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.carMatchId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarMatch ');
        return callback(error,rows);
    });
}

function deleteCarMatch(params,callback){
    var query = " delete from car_match where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.carMatchId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteCarMatch ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarMatch : addCarMatch,
    getCarMatch : getCarMatch,
    updateCarMatch : updateCarMatch,
    deleteCarMatch : deleteCarMatch
}