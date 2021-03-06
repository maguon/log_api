/**
 * Created by yym on 2020/8/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageQaTaskDAO.js');

function addDamageQaTask(params,callback){
    var query = " insert into damage_qa_task (upload_id,car_count,qa_car_count,date_id) " +
        " VALUES ( ? ,(" +
        " SELECT count(*) FROM car_info WHERE upload_id = ? ),0, ?)";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.uploadId;
    paramsArray[i++] = params.uploadId;
    paramsArray[i] = params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageQaTask ');
        return callback(error,rows);
    });
}

function getDamageQaTask(params,callback) {
    var query = " select * from damage_qa_task " +
        " where id is not null ";
    var paramsArray=[],i=0;
    if(params.damageQaTaskId){
        paramsArray[i++] = params.damageQaTaskId;
        query = query + " and id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and date_id <= ? ";
    }
    query = query + ' order by id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageQaTask ');
        return callback(error,rows);
    });
}

function getQaUploadId(params,callback) {
    var query = " select * from damage_qa_task " +
        " where id is not null ";
    var paramsArray=[],i=0;
    if(params.uploadId){
        paramsArray[i++] = params.uploadId;
        query = query + " and upload_id = ? ";
    }
    query = query + ' order by id desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getQaUploadId ');
        return callback(error,rows);
    });
}

function updateDtStatus(params,callback){
    var query = " update damage_qa_task set qa_car_count = qa_car_count + 1 where id = (" +
        "SELECT dr.qt_id FROM damage_qa_task_car_rel dr WHERE dr.car_id = ? )" ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDtStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamageQaTask : addDamageQaTask,
    getDamageQaTask : getDamageQaTask,
    getQaUploadId : getQaUploadId,
    updateDtStatus : updateDtStatus
}
