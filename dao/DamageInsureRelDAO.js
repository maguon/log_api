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
    var query = " select dir.id,dir.damage_insure_id,dir.damage_id,di.created_on,ti.insure_name, " +
        " di.damage_money,di.insure_plan,di.insure_actual,u.real_name as insure_user_name, " +
        " di.city_name,di.declare_date,di.liability_type,di.ref_remark,di.derate_money,di.car_valuation,di.invoice_money, " +
        " c.vin,e.short_name as e_short_name,r.short_name as r_short_name,dc.damage_type, " +
        " dc.under_user_name,d.drive_name,d.truck_num,d.damage_explain " +
        " from damage_insure_rel dir " +
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
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and di.insure_id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and di.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and di.created_on <= ? ";
    }
    if(params.damageId){
        paramsArray[i++] = params.damageId;
        query = query + " and d.id = ? ";
    }
    if(params.financialLoanStatus){
        paramsArray[i++] = params.financialLoanStatus;
        query = query + " and di.financial_loan_status = ? ";
    }
    if(params.insurePlanStart){
        paramsArray[i++] = params.insurePlanStart;
        query = query + " and di.insure_plan >= ? ";
    }
    if(params.insurePlanEnd){
        paramsArray[i++] = params.insurePlanEnd;
        query = query + " and di.insure_plan <= ? ";
    }
    if(params.insureStatus){
        paramsArray[i++] = params.insureStatus;
        query = query + " and di.insure_status = ? ";
    }
    if(params.insureUserId){
        paramsArray[i++] = params.insureUserId;
        query = query + " and di.insure_user_id = ? ";
    }
    if(params.insureUserName){
        paramsArray[i++] = params.insureUserName;
        query = query + " and u.real_name = ? ";
    }
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and di.city_id = ? ";
    }
    if(params.liabilityType){
        paramsArray[i++] = params.liabilityType;
        query = query + " and di.liability_type = ? ";
    }
    query = query + " group by dir.id ";
    query = query + " order by dir.id desc ";
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

