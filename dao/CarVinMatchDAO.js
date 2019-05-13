/**
 * Created by zwl on 2019/5/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarVinMatchDAO.js');

function addCarVinMatch(params,callback){
    var query = " insert into car_vin_match (vin,make_id,make_name)  values ( ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarVinMatch ');
        return callback(error,rows);
    });
}

function getCarVinMatch(params,callback) {
    var query = " select * from car_vin_match where id is not null ";
    var paramsArray=[],i=0;
    if(params.carVinMatchId){
        paramsArray[i++] = params.carVinMatchId;
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
        logger.debug(' getCarVinMatch ');
        return callback(error,rows);
    });
}

function updateCarVinMatch(params,callback){
    var query = " update car_vin_match set vin = ? , make_id = ? , make_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.carVinMatchId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarVinMatch ');
        return callback(error,rows);
    });
}

function deleteCarVinMatch(params,callback){
    var query = " delete from car_vin_match where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.carVinMatchId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteCarVinMatch ');
        return callback(error,rows);
    });
}


module.exports ={
    addCarVinMatch : addCarVinMatch,
    getCarVinMatch : getCarVinMatch,
    updateCarVinMatch : updateCarVinMatch,
    deleteCarVinMatch : deleteCarVinMatch
}