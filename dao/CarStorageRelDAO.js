/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarStorageRelDAO.js');

function addCarStorageRel(params,callback){
    var query = " insert into car_storage_rel (car_id,storage_id,storage_name,enter_time,plan_out_time) " +
        " values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.storageId;
    paramsArray[i++]=params.storageName;
    paramsArray[i++]=params.enterTime;
    paramsArray[i]=params.planOutTime;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarStorageRel ');
        return callback(error,rows);
    });
}

function updateRelStatus(params,callback){
    var query = " update car_storage_rel set real_out_time = sysdate() , rel_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.relStatus;
    paramsArray[i] = params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRelStatus ');
        return callback(error,rows);
    });
}

//getRel出库等操作查询判断使用

module.exports ={
    addCarStorageRel : addCarStorageRel,
    updateRelStatus : updateRelStatus
}