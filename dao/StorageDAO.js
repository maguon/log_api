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

function getStorageDate(params,callback) {
    var query = " select d.*,s.* from storage_stat_date d left join storage_info s on d.storage_id = s.id where d.date_id is not null ";
    var paramsArray=[],i=0;
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and s.id = ? ";
    }
    if(params.storageName){
        paramsArray[i++] = params.storageName;
        query = query + " and storage_name = ? ";
    }
    if(params.dateStart){
        paramsArray[i++] = params.dateStart;
        query = query + " and d.date_id >= ? ";
    }
    if(params.dateEnd){
        paramsArray[i++] = params.dateEnd;
        query = query + " and d.date_id <= ? ";
    }
    if(params.dateStartMonth){
        paramsArray[i++] = params.dateStartMonth;
        query = query + " and date_format(d.date_id,'%Y%m') >= ? ";
    }
    if(params.dateEndMonth){
        paramsArray[i] = params.dateEndMonth;
        query = query + " and date_format(d.date_id,'%Y%m') <= ? ";
    }

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageDate ');
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
    getStorageDate : getStorageDate,
    updateStorage : updateStorage,
    updateStorageStatus : updateStorageStatus
}