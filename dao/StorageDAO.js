/**
 * Created by zwl on 2017/4/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageDAO.js');

function addStorage(params,callback){
    var query = " insert into storage_info (storage_name,col,road,remark) values (? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageName;
    paramsArray[i++]=params.row;
    paramsArray[i++]=params.road;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorage ');
        return callback(error,rows);
    });
}

function getStorage(params,callback) {
    var query = " select * from storage_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and id = ? ";
    }
    if(params.storageName){
        paramsArray[i++] = params.storageName;
        query = query + " and storage_name = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorage ');
        return callback(error,rows);
    });
}

function updateStorage(params,callback){
    var query = " update storage_info set storage_name = ? ,col = ? , road = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageName;
    paramsArray[i++]=params.row;
    paramsArray[i++]=params.road;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.storageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorage ');
        return callback(error,rows);
    });
}

function updateStorageStatus(params,callback){
    var query = " update storage_info set storage_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.storageStatus;
    paramsArray[i] = params.storageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateStorageStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addStorage : addStorage,
    getStorage : getStorage,
    updateStorage : updateStorage,
    updateStorageStatus : updateStorageStatus
}