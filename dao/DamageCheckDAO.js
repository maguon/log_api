/**
 * Created by zwl on 2017/11/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageCheckDAO.js');

function addDamageCheck(params,callback){
    var query = " insert into damage_check (damage_id,under_user_id,under_user_name,damage_type,damage_link_type,refund_user_id,refund_user_name," +
        " reduction_cost,penalty_cost,profit,repair_id,repair_cost,transport_cost,under_cost,company_cost, sc_payment_date ,op_user_id,date_id,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
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
    paramsArray[i++]=params.scPaymentDate == ""?null:params.scPaymentDate;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageCheck ');
        return callback(error,rows);
    });
}

function getDamageCheck(params,callback) {
    var query = " select dc.*,rs.repair_station_name,u2.type as under_user_type,u3.real_name as op_user_name, " +
        " c.route_end_id,c.route_end,c.receive_id,r.short_name as re_short_name from damage_check dc " +
        " left join damage_info da on dc.damage_id = da.id " +
        " left join user_info u2 on dc.under_user_id = u2.uid " +
        " left join user_info u3 on dc.op_user_id = u3.uid " +
        " left join repair_station_info rs on dc.repair_id = rs.id " +
        " left join car_info c on da.car_id = c.id " +
        " left join receive_info r on c.receive_id = r.id " +
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
        " transport_cost = ? , under_cost = ? , company_cost = ? , op_user_id = ? , sc_payment_date = ? ,remark = ? where id = ? and damage_id = ? " ;
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
    paramsArray[i++]=params.scPaymentDate == ""?null:params.scPaymentDate;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.damageCheckId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageCheck ');
        return callback(error,rows);
    });
}

function updateScPayment(params,callback){
    var query = " UPDATE damage_check SET sc_payment = ? ," +
        " sc_profit = ? - IFNULL( ( SELECT actual_money FROM damage_check_indemnity WHERE damage_id = ? ), 0 ) " +
        " WHERE damage_id IS NOT NULL AND damage_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.scPayment||0;
    paramsArray[i++]=params.scPayment||0;
    paramsArray[i++]=params.damageId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateScPayment ');
        return callback(error,rows);
    });
}

function updateScPaymentByDamageId(params,callback){
    // var query = " UPDATE damage_check " +
    //     " SET sc_profit = sc_payment - " + params.actualMoney +
    //     " WHERE damage_id = " + params.damageId;

    var query = " UPDATE damage_check " +
        "SET sc_profit = sc_payment - ( SELECT actual_money FROM damage_check_indemnity WHERE id = " + params.indemnityId +" ) " +
        "WHERE damage_id IS NOT NULL AND " +
        "damage_id = ( SELECT damage_id FROM damage_check_indemnity WHERE id = " + params.indemnityId + " ) ";

    var paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateScPaymentByDamageId ');
        return callback(error,rows);
    });
}

function updateDamageCheckFinishTime(params,callback){
    var query = " update damage_check set op_user_id = ? , date_id = ? where id = ? and damage_id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.damageCheckId;
    paramsArray[i]=params.damageId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageCheckFinishTime ');
        return callback(error,rows);
    });
}

function updateDamageCheckDateId(params,callback){
    var query = " update damage_check set date_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.damageCheckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageCheckDateId ');
        return callback(error,rows);
    });
}

function updateDamageCheckIndemnityStatus(params,callback){
    var query = " update damage_check set damage_indemnity_status = ? where id = ? and damage_indemnity_status=1" ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageIndemnityStatus;
    paramsArray[i]=params.damageCheckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageCheckIndemnityStatus ');
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
    var query = " select db.y_month,dc.under_user_id,dc.under_user_name,sum(dc.under_cost) as total_under_cost, " +
        " count(dc.id) as under_count from damage_check dc " +
        " left join date_base db on dc.date_id = db.id where  dc.id is not null " ;
    var paramsArray=[],i=0;
    if(params.underUserId){
        paramsArray[i++] = params.underUserId;
        query = query + " and dc.under_user_id = ? ";
    }
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


module.exports ={
    addDamageCheck : addDamageCheck,
    getDamageCheck : getDamageCheck,
    updateDamageCheck : updateDamageCheck,
    updateScPayment : updateScPayment,
    updateScPaymentByDamageId : updateScPaymentByDamageId,
    updateDamageCheckFinishTime : updateDamageCheckFinishTime,
    updateDamageCheckDateId : updateDamageCheckDateId,
    updateDamageCheckIndemnityStatus : updateDamageCheckIndemnityStatus,
    getDamageCheckMonthStat  : getDamageCheckMonthStat,
    getDamageCheckWeekStat : getDamageCheckWeekStat,
    getDamageCheckUnderMonthStat : getDamageCheckUnderMonthStat,
    getDamageCheckUnderWeekStat : getDamageCheckUnderWeekStat
}