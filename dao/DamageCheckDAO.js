/**
 * Created by zwl on 2017/11/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageCheckDAO.js');

function addDamageCheck(params,callback){
    var query = " insert into damage_check (damage_id,under_user_id,under_user_name,damage_type,damage_link_type,refund_user_id,refund_user_name," +
        " reduction_cost,penalty_cost,profit,repair_id,repair_cost,transport_cost,under_cost,company_cost,op_user_id,date_id,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageId;
    paramsArray[i++]=params.underUserId;
    paramsArray[i++]=params.underUserName;
    paramsArray[i++]=params.damageType;
    paramsArray[i++]=params.damageLinkType;
    paramsArray[i++]=params.refundUserId;
    paramsArray[i++]=params.refundUserName;
    paramsArray[i++]=params.reductionCost;
    paramsArray[i++]=params.penaltyCost;
    paramsArray[i++]=params.profit;
    paramsArray[i++]=params.repairId;
    paramsArray[i++]=params.repairCost;
    paramsArray[i++]=params.transportCost;
    paramsArray[i++]=params.underCost;
    paramsArray[i++]=params.companyCost;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageCheck ');
        return callback(error,rows);
    });
}

function getDamageCheck(params,callback) {
    var query = " select dc.*,ri.repair_name,u3.real_name as op_user_name from damage_check dc " +
        " left join damage_info da on dc.damage_id = da.id " +
        " left join user_info u3 on dc.op_user_id = u3.uid " +
        " left join repair_info ri on dc.repair_id = ri.id " +
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
    var query = " update damage_check set under_user_id = ? , under_user_name = ? , damage_type = ? , damage_link_type = ? , " +
        " refund_user_id = ? , refund_user_name = ? , reduction_cost = ?, penalty_cost = ? , profit = ? , repair_id = ? , repair_cost = ? , " +
        " transport_cost = ? , under_cost = ? , company_cost = ? , op_user_id = ? , date_id = ? , remark = ? where id = ? and damage_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.underUserId;
    paramsArray[i++]=params.underUserName;
    paramsArray[i++]=params.damageType;
    paramsArray[i++]=params.damageLinkType;
    paramsArray[i++]=params.refundUserId;
    paramsArray[i++]=params.refundUserName;
    paramsArray[i++]=params.reductionCost;
    paramsArray[i++]=params.penaltyCost;
    paramsArray[i++]=params.profit;
    paramsArray[i++]=params.repairId;
    paramsArray[i++]=params.repairCost;
    paramsArray[i++]=params.transportCost;
    paramsArray[i++]=params.underCost;
    paramsArray[i++]=params.companyCost;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.damageCheckId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageCheck ');
        return callback(error,rows);
    });
}

function getDamageCheckMonthStat(params,callback){
    var query = " select db.y_month,sum(dc.company_cost) as company_cost,sum(dc.under_cost) as under_cost," +
        " sum(dc.repair_cost) as repair_cost from date_base db " +
        " left join damage_check dc  on db.id = dc.date_id where  db.id is not null " ;
    var paramsArray=[],i=0;
    if(params.yearMonth){
        paramsArray[i++] = params.yearMonth;
        query = query + " and db.y_month = ? ";
    }
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
        logger.debug(' getDamageCheckMonthStat ');
        return callback(error,rows);
    });
}

function getDamageCheckWeekStat(params,callback) {
    var query = " select db.y_week,sum(dc.company_cost) as company_cost,sum(dc.under_cost) as under_cost, " +
        " sum(dc.repair_cost) as repair_cost from date_base db " +
        " left join damage_check dc on db.id = dc.date_id where db.id is not null ";
    var paramsArray=[],i=0;
    query = query + ' group by db.y_week ';
    query = query + ' order by db.y_week desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageCheckWeekStat ');
        return callback(error,rows);
    });
}

function getDamageCheckUnderMonthStat(params,callback){
    var query = " select db.y_month,dc.under_user_id,dc.under_user_name,sum(dc.under_cost) as total_under_cost from damage_check dc " +
        " left join date_base db on dc.date_id = db.id where  dc.id is not null " ;
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month,dc.under_user_id,dc.under_user_name ';
    query = query + ' order by total_under_cost desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageCheckUnderMonthStat ');
        return callback(error,rows);
    });
}

function getDamageCheckUnderWeekStat(params,callback){
    var query = " select db.y_week,dc.under_user_id,dc.under_user_name,sum(dc.under_cost) total_under_cost from damage_check dc " +
        " left join date_base db on dc.date_id = db.id where  dc.id is not null " ;
    var paramsArray=[],i=0;
    if(params.yWeek){
        paramsArray[i++] = params.yWeek;
        query = query + " and db.y_week = ? ";
    }
    query = query + ' group by db.y_week,dc.under_user_id,dc.under_user_name ';
    query = query + ' order by total_under_cost desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageCheckUnderWeekStat ');
        return callback(error,rows);
    });
}

function getDamageCheckStat(params,callback){
    var query = "select count(dc.id),sum(dc.reduction_cost) total_reduce_cost, " +
        " sum(dc.penalty_cost) total_penalty_cost ,sum(dc.profit) total_profit,sum(dc.repair_cost) total_repair_cost, " +
        " sum(dc.transport_cost) total_trans_cost,sum(dc.under_cost) total_under_cost,sum(dc.company_cost) total_com_cost " ;
    if(params.damageType){
        query = query + " , dc.damage_type "
    }
    if(params.damageLinkeType){
        query = query + " , dc.damage_link_type "
    }
        " from damage_check dc left join date_base db on dc.date_id = db.id " +
        " group by dc.damage_type"
}


module.exports ={
    addDamageCheck : addDamageCheck,
    getDamageCheck : getDamageCheck,
    updateDamageCheck : updateDamageCheck ,
    getDamageCheckMonthStat  : getDamageCheckMonthStat,
    getDamageCheckWeekStat : getDamageCheckWeekStat,
    getDamageCheckUnderMonthStat : getDamageCheckUnderMonthStat,
    getDamageCheckUnderWeekStat : getDamageCheckUnderWeekStat
}