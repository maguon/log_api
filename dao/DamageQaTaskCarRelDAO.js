/**
 * Created by yym on 2020/8/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageQaTaskCarRelDAO.js');

function addDamageQaTaskCarRel(params,callback){
    var query = " INSERT INTO damage_qa_task_car_rel ( qt_id, car_id, qa_status,date_id)" +
        " SELECT ? , id , ? ,? FROM car_info WHERE upload_id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.qtId;
    paramsArray[i++] = params.qaStatus;
    paramsArray[i++] = params.dateId;
    paramsArray[i] = params.uploadId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageQaTaskCarRel ');
        return callback(error,rows);
    });
}

function getDamageQaTaskCarRel(params,callback) {
    var query = " select dqtcr.*,c.vin from damage_qa_task_car_rel dqtcr" +
        " left join car_info c on dqtcr.car_id = c.id " +
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

module.exports ={
    addDamageQaTaskCarRel : addDamageQaTaskCarRel,
    getDamageQaTaskCarRel : getDamageQaTaskCarRel
}
