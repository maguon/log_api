/**
 * Created by zwl on 2017/4/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageDAO.js');

function addStorage(params,callback){
    var query = " insert into storage_info (storage_name,row,col,remark) values (? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageName;
    paramsArray[i++]=params.row;
    paramsArray[i++]=params.col;
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
    if(params.storageStatus){
        paramsArray[i] = params.storageStatus;
        query = query + " and storage_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorage ');
        return callback(error,rows);
    });
}

function getStorageToday(params,callback) {
    var query = " select s.*,count(p.id) as pCount,d.imports,d.exports,d.balance from storage_info s " +
        " left join (select * from storage_stat_date where date_id = current_date()) d on s.id = d.storage_id " +
        " left join (select * from storage_parking where car_id = 0) p on s.id = p.storage_id where s.id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and s.id = ? ";
    }
    if(params.storageName){
        paramsArray[i++] = params.storageName;
        query = query + " and storage_name = ? ";
    }
    query = query + ' group by s.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorage ');
        return callback(error,rows);
    });
}

function updateStorage(params,callback){
    var query = " update storage_info set storage_name = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageName;
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
    getStorageToday : getStorageToday,
    updateStorage : updateStorage,
    updateStorageStatus : updateStorageStatus
}