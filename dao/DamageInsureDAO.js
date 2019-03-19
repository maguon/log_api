/**
 * Created by zwl on 2017/11/17.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureDAO.js');

function addDamageInsure(params,callback){
    var query = " insert into damage_insure (insure_id,insure_user_id," +
        " city_id,city_name,declare_date,liability_type,ref_remark,derate_money,car_valuation,invoice_money, " +
        " damage_money,insure_plan,financial_loan_status,financial_loan,payment_explain) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i++]=params.declareDate;
    paramsArray[i++]=params.liabilityType;
    paramsArray[i++]=params.refRemark;
    paramsArray[i++]=params.derateMoney;
    paramsArray[i++]=params.carValuation;
    paramsArray[i++]=params.invoiceMoney;
    paramsArray[i++]=params.damageMoney;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.financialLoanStatus;
    paramsArray[i++]=params.financialLoan;
    paramsArray[i]=params.paymentExplain;
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
    if(params.declareDateStart){
        paramsArray[i++] = params.declareDateStart;
        query = query + " and di.declare_date >= ? ";
    }
    if(params.declareDateEnd){
        paramsArray[i++] = params.declareDateEnd;
        query = query + " and di.declare_date <= ? ";
    }
    query = query + " group by di.id ";
    query = query + " order by di.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageInsure ');
        return callback(error,rows);
    });
}

function updateDamageInsure(params,callback){
    var query = " update damage_insure set insure_id = ? , city_id = ? , city_name = ? , " +
        " declare_date = ? , liability_type = ? , ref_remark = ? , derate_money = ? , car_valuation = ? , invoice_money = ? ," +
        " damage_money = ? , insure_plan = ? , financial_loan = ? , payment_explain = ? , insure_actual = ? , check_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i++]=params.declareDate;
    paramsArray[i++]=params.liabilityType;
    paramsArray[i++]=params.refRemark;
    paramsArray[i++]=params.derateMoney;
    paramsArray[i++]=params.carValuation;
    paramsArray[i++]=params.invoiceMoney;
    paramsArray[i++]=params.damageMoney;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.financialLoan;
    paramsArray[i++]=params.paymentExplain;
    paramsArray[i++]=params.insureActual;
    paramsArray[i++]=params.checkExplain;
    paramsArray[i]=params.damageInsureId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageInsure ');
        return callback(error,rows);
    });
}

function updateDamageInsureStatus(params,callback){
    var query = " update damage_insure set insure_status = ? , completed_date = ? , date_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureStatus;
    paramsArray[i++]=params.completedDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.damageInsureId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageInsureStatus ');
        return callback(error,rows);
    });
}

function getDamageInsureMonthStat(params,callback){
    var query = " select db.y_month,count(case when di.insure_status = "+params.insureStatus+" then di.id end) as damage_insure_count, " +
        " sum(case when di.insure_status = "+params.insureStatus+" then di.insure_actual end) as damage_insure, " +
        " sum(case when di.insure_status = "+params.insureStatus+" then di.insure_plan end) as insure_plan from date_base db " +
        " left join damage_insure di  on db.id = di.date_id where  db.id is not null " ;
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
    addDamageInsure : addDamageInsure,
    getDamageInsure : getDamageInsure,
    updateDamageInsure : updateDamageInsure,
    updateDamageInsureStatus : updateDamageInsureStatus,
    getDamageInsureMonthStat : getDamageInsureMonthStat,
    getDamageInsureWeekStat : getDamageInsureWeekStat
}
