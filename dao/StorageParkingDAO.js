/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageParkingDAO.js');

function addStorageParking(params,callback){
    var query = " insert into storage_parking (storage_id,row,col) values (? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageId;
    paramsArray[i++]=params.row;
    paramsArray[i]=params.col;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorageParking ');
        return callback(error,rows);
    });
}

function getStorageParking(params,callback) {
    var query = " select p.* from storage_parking p inner join storage_info s on p.storage_id = s.id where p.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i] = params.storageId;
        query = query + " and s.id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageParking ');
        return callback(error,rows);
    });
}

function updateStorageParking(params,callback){
    var query = " update storage_parking set car_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carId;
    paramsArray[i]=params.parkingId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageParking ');
        return callback(error,rows);
    });
}

function updateStorageParkingOut(params,callback){
    var query = " update storage_parking set car_id= 0 where id = ? and storage_id= ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.parkingId;
    paramsArray[i]=params.storageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageParkingOut ');
        return callback(error,rows);
    });
}

module.exports ={
    addStorageParking : addStorageParking,
    getStorageParking : getStorageParking,
    updateStorageParking : updateStorageParking,
    updateStorageParkingOut : updateStorageParkingOut
}
