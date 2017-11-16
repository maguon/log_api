/**
 * Created by zwl on 2017/11/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageCheckDAO.js');

function addDamageCheck(params,callback){
    var query = " insert into damage_check (damage_id,under_user_id,damage_type,damage_link_type,refund_user_id," +
        " reduction_cost,penalty_cost,profit,repair_id,repair_cost,transport_cost,under_cost,company_cost,op_user_id,end_date,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageId;
    paramsArray[i++]=params.underUserId;
    paramsArray[i++]=params.damageType;
    paramsArray[i++]=params.damageLinkType;
    paramsArray[i++]=params.refundUserId;
    paramsArray[i++]=params.reductionCost;
    paramsArray[i++]=params.penaltyCost;
    paramsArray[i++]=params.profit;
    paramsArray[i++]=params.repairId;
    paramsArray[i++]=params.repairCost;
    paramsArray[i++]=params.transportCost;
    paramsArray[i++]=params.underCost;
    paramsArray[i++]=params.companyCost;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.endDate;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageCheck ');
        return callback(error,rows);
    });
}

function getDamageCheck(params,callback) {
    var query = " select dc.* from damage_check dc " +
        " left join damage_info da on dc.damage_id = da.id " +
        " left join user_info u1 on dc.under_user_id = u1.uid " +
        " left join user_info u2 on dc.refund_user_id = u2.uid " +
        " left join user_info u3 on dc.op_user_id = u3.uid " +
        " where dc.id is not null ";
    var paramsArray=[],i=0;
    if(params.damageCheckId){
        paramsArray[i++] = params.damageCheckId;
        query = query + " and dc.id = ? ";
    }
    if(params.damageId){
        paramsArray[i++] = params.damageId;
        query = query + " and dc.damage_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageCheck ');
        return callback(error,rows);
    });
}

function updateDamageCheck(params,callback){
    var query = " update damage_check set under_user_id = ? , damage_type = ? , damage_link_type = ? , refund_user_id = ? , " +
        "reduction_cost = ?, penalty_cost = ? , profit = ? , repair_id = ? , repair_cost = ? , transport_cost = ? , under_cost = ? , " +
        " company_cost = ? , op_user_id = ? , end_date = ? , remark = ? where id = ? and damage_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.underUserId;
    paramsArray[i++]=params.damageType;
    paramsArray[i++]=params.damageLinkType;
    paramsArray[i++]=params.refundUserId;
    paramsArray[i++]=params.reductionCost;
    paramsArray[i++]=params.penaltyCost;
    paramsArray[i++]=params.profit;
    paramsArray[i++]=params.repairId;
    paramsArray[i++]=params.repairCost;
    paramsArray[i++]=params.transportCost;
    paramsArray[i++]=params.underCost;
    paramsArray[i++]=params.companyCost;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.damageCheckId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageCheck ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamageCheck : addDamageCheck,
    getDamageCheck : getDamageCheck,
    updateDamageCheck : updateDamageCheck
}