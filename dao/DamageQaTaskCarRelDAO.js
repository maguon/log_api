/**
 * Created by yym on 2020/8/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageQaTaskCarRelDAO.js');

function addDamageQaTaskCarRel(params,callback){
    var query = " INSERT INTO damage_qa_task_car_rel ( qt_id, car_id, qa_status)" +
        " SELECT ? , id , ?  FROM car_info WHERE upload_id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.qtId;
    paramsArray[i++] = params.qaStatus;
    paramsArray[i] = params.uploadId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageQaTaskCarRel ');
        return callback(error,rows);
    });
}

function getDamageQaTaskCarRel(params,callback) {
    var query = " select dqtcr.*,c.vin,u.real_name from damage_qa_task_car_rel dqtcr" +
        " left join car_info c on dqtcr.car_id = c.id " +
        " left join user_info u on dqtcr.user_id = u.uid " +
        " where dqtcr.id is not null ";
    var paramsArray=[],i=0;
    if(params.qtId){
        paramsArray[i++] = params.qtId;
        query = query + " and dqtcr.qt_id = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.qaStatus){
        paramsArray[i++] = params.qaStatus;
        query = query + " and dqtcr.qa_status = ? ";
    }
    if(params.qaUserId){
        paramsArray[i++] = params.qaUserId;
        query = query + " and dqtcr.user_Id = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and dqtcr.date_id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i++] = params.dateIdEnd;
        query = query + " and dqtcr.date_id <= ? ";
    }
    query = query + ' order by dqtcr.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageQaTaskCarRel ');
        return callback(error,rows);
    });
}

function damageQaTaskDayStat(params,callback){
    var paramsArray=[],i=0;

    var query = " select db.id,IFNULL(dr_temp.qa_count,0) as qa_count " +
        " from date_base db " +
        " LEFT JOIN ( SELECT dr.date_id, count( dr.id ) qa_count FROM damage_qa_task_car_rel dr " +
        " WHERE dr.qa_status = 1 " ;

    if(params.qaUserId){
        paramsArray[i++] = params.qaUserId;
        query = query + " and dr.user_id = ? ";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and dr.date_id = ? ";
    }
    query += " GROUP BY dr.date_id " ;
    query += " ORDER BY dr.date_id DESC " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }else{
        query += " limit 0 , 10 "
    }
    query += " ) AS dr_temp ON db.id = dr_temp.date_id  " +
        " where db.id is not null ";

    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and db.id = ? ";
    }
    query = query + ' order by db.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }else{
        query += " limit 0 , 10 "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' damageQaTaskDayStat ');
        return callback(error,rows);
    });
}

function damageQaTaskUserStat(params,callback){
    var paramsArray=[],i=0;

    var query = " SELECT u.real_name, count( dr.user_id ) qa_count FROM damage_qa_task_car_rel dr " +
        " left join user_info u on dr.user_id = u.uid " +
        " WHERE dr.qa_status = 1 " ;

    if(params.qtId){
        paramsArray[i++] = params.qtId;
        query = query + " and dr.qt_id = ? ";
    }
    query += " GROUP BY dr.user_id " ;
    query += " ORDER BY qa_count DESC " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' damageQaTaskUserStat ');
        return callback(error,rows);
    });
}

module.exports ={
    addDamageQaTaskCarRel : addDamageQaTaskCarRel,
    getDamageQaTaskCarRel : getDamageQaTaskCarRel,
    damageQaTaskDayStat : damageQaTaskDayStat,
    damageQaTaskUserStat : damageQaTaskUserStat
}
