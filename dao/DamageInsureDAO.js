/**
 * Created by zwl on 2017/11/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureDAO.js');

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


module.exports ={
    addDamageInsure : addDamageInsure,
    getDamageInsure : getDamageInsure
}
