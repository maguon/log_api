/**
 * Created by zwl on 2017/8/10.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageAreaDAO.js');

function addStorageArea(params,callback){
    var query = " insert into storage_area_info (storage_id,area_name,row,col,remark) values (? , ? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.storageId;
    paramsArray[i++]=params.areaName;
    paramsArray[i++]=params.row;
    paramsArray[i++]=params.col;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addStorageArea ');
        return callback(error,rows);
    });
}

function getStorageArea(params,callback) {
    var query = " select * from storage_area_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.areaId){
        paramsArray[i++] = params.areaId;
        query = query + " and id = ? ";
    }
    if(params.areaName){
        paramsArray[i++] = params.areaName;
        query = query + " and area_name = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and storage_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getStorageArea ');
        return callback(error,rows);
    });
}


module.exports ={
    addStorageArea : addStorageArea,
    getStorageArea : getStorageArea
}