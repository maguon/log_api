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


module.exports ={
    addDamageCheck : addDamageCheck
}