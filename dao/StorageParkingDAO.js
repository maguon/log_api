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
    var query = " select p.*,r.id as rId,r.car_id as r_carId,r.storage_id as r_storageId,r.storage_name as r_storageName, " +
        " r.enter_time as r_enterTime, r.plan_out_time as r_planOutTime,r.real_out_time as r_realOutTime,r.rel_status as r_relStatus " +
        " from storage_parking p left join storage_info s on p.storage_id = s.id left join car_storage_rel r on p.car_id = r.car_id where p.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and s.id = ? ";
    }
    if(params.parkingId){
        paramsArray[i++] = params.parkingId;
        query = query + " and p.id = ? ";
    }
/*    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and p.car_id = ? ";
    }*/
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

function updateStorageParkingMove(params,callback){
    var query = " update storage_parking set car_id= 0 where id = ? and storage_id= ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.originParkingId;
    paramsArray[i]=params.storageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageParkingMove ');
        return callback(error,rows);
    });
}

function updateStorageParkingOut(params,callback){
    var query = " update storage_parking set car_id= 0 where id = ? and storage_id= ? and car_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.parkingId;
    paramsArray[i++]=params.storageId;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageParkingOut ');
        return callback(error,rows);
    });
}

module.exports ={
    addStorageParking : addStorageParking,
    getStorageParking : getStorageParking,
    updateStorageParking : updateStorageParking,
    updateStorageParkingMove : updateStorageParkingMove,
    updateStorageParkingOut : updateStorageParkingOut
}
