/**
 * Created by zwl on 2017/11/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureDAO.js');

function addInsure(params,callback){
    var query = " insert into damage_insure (insure_id,insure_user_id,insure_plan,insure_actual,date_id) " +
        " values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.insureActual;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addInsure ');
        return callback(error,rows);
    });
}

function addDamageInsure(params,callback){
    var query = " insert into damage_insure (insure_id,insure_user_id,insure_plan,insure_actual,date_id) " +
        " values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.insureActual;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageInsure ');
        return callback(error,rows);
    });
}

function getDamageInsure(params,callback) {
    var query = " select di.*,ti.insure_name,u.real_name as insure_user_name from damage_insure di " +
        " left join damage_insure_rel dir on di.id = dir.damage_insure_id " +
        " left join damage_info d on dir.damage_id = d.id " +
        " left join truck_insure ti on di.insure_id = ti.id " +
        " left join user_info u on di.insure_user_id = u.uid " +
        " where di.id is not null ";
    var paramsArray=[],i=0;
    if(params.damageInsureId){
        paramsArray[i++] = params.damageInsureId;
        query = query + " and di.id = ? ";
    }
    if(params.damageId){
        paramsArray[i++] = params.damageId;
        query = query + " and d.id = ? ";
    }
    if(params.insureStatus){
        paramsArray[i++] = params.insureStatus;
        query = query + " and di.insure_status = ? ";
    }
    if(params.insureActualStart){
        paramsArray[i++] = params.insureActualStart;
        query = query + " and di.insure_actual >= ? ";
    }
    if(params.insureActualEnd){
        paramsArray[i++] = params.insureActualEnd;
        query = query + " and di.insure_actual <= ? ";
    }
    if(params.insureUserId){
        paramsArray[i++] = params.insureUserId;
        query = query + " and di.insure_user_id = ? ";
    }
    if(params.insureUserName){
        paramsArray[i++] = params.insureUserName;
        query = query + " and u.real_name = ? ";
    }
    query = query + " group by di.id ";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageInsure ');
        return callback(error,rows);
    });
}

function updateDamageInsure(params,callback){
    var query = " update damage_insure set insure_plan = ?,insure_actual = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.insureActual;
    paramsArray[i]=params.damageInsureId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageInsure ');
        return callback(error,rows);
    });
}

function getDamageInsureMonthStat(params,callback){
    var query = " select db.y_month,count(case when di.insure_status = "+params.insureStatus+" then di.id end) as damage_insure_count, " +
        " sum(case when di.insure_status = "+params.insureStatus+" then di.insure_actual end) as damage_insure from date_base db " +
        " left join damage_insure di  on db.id = di.date_id where  db.id is not null " ;
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month ';
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageInsureMonthStat ');
        return callback(error,rows);
    });
}

function getDamageInsureWeekStat(params,callback) {
    var query = " select db.y_week,count(case when di.insure_status = "+params.insureStatus+" then di.id end) as damage_insure_count, " +
        " sum(case when di.insure_status = "+params.insureStatus+" then di.insure_actual end) as damage_insure from date_base db " +
        " left join damage_insure di  on db.id = di.date_id where  db.id is not null " ;
    var paramsArray=[],i=0;
    query = query + ' group by db.y_week ';
    query = query + ' order by db.y_week desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageInsureWeekStat ');
        return callback(error,rows);
    });
}


module.exports ={
    addInsure : addInsure,
    addDamageInsure : addDamageInsure,
    getDamageInsure : getDamageInsure,
    updateDamageInsure : updateDamageInsure,
    getDamageInsureMonthStat : getDamageInsureMonthStat,
    getDamageInsureWeekStat : getDamageInsureWeekStat
}
