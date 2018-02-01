/**
 * Created by zwl on 2018/1/26.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureRelDAO.js');

function addDamageInsureRel(params,callback){
    var query = " insert into damage_insure_rel (damage_insure_id,damage_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageInsureId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageInsureRel ');
        return callback(error,rows);
    });
}

function getDamageInsureRel(params,callback) {
    var query = " select dir.id,dir.damage_insure_id,dir.damage_id,di.created_on as damage_insure_date, " +
        " di.insure_plan,di.insure_actual,ti.insure_name,u.real_name as insure_user_name,c.vin, " +
        " e.short_name as e_short_name,r.short_name as r_short_name,dc.damage_type, " +
        " dc.under_user_name,d.drive_name,d.truck_num,d.damage_explain from damage_insure_rel dir " +
        " left join damage_insure di  on di.id = dir.damage_insure_id " +
        " left join damage_info d on dir.damage_id = d.id " +
        " left join damage_check dc on d.id = dc.damage_id " +
        " left join car_info c on d.car_id = c.id " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join truck_insure ti on di.insure_id = ti.id " +
        " left join user_info u on di.insure_user_id = u.uid " +
        " where dir.id is not null ";
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
    query = query + " group by dir.id ";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageInsureRel ');
        return callback(error,rows);
    });
}

function deleteDamageInsureRel(params,callback){
    var query = " delete from damage_insure_rel where damage_insure_id = ? and damage_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.damageInsureId;
    paramsArray[i++] = params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDamageInsureRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamageInsureRel : addDamageInsureRel,
    getDamageInsureRel : getDamageInsureRel,
    deleteDamageInsureRel : deleteDamageInsureRel
}

