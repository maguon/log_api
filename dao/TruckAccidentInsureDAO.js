/**
 * Created by zwl on 2018/2/7.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentInsureDAO.js');

function addTruckAccidentInsure(params,callback){
    var query = " insert into truck_accident_insure ( insure_id , insure_type , insure_plan , insure_user_id , " +
        " financial_loan_status , financial_loan , payment_explain ) values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.financialLoanStatus;
    paramsArray[i++]=params.financialLoan;
    paramsArray[i]=params.paymentExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckAccidentInsure ');
        return callback(error,rows);
    });
}

function getTruckAccidentInsure(params,callback) {
    var query = " select tai.*,ti.insure_name,u.real_name as insure_user_name from truck_accident_insure tai " +
        " left join truck_insure ti on tai.insure_id = ti.id " +
        " left join truck_accident_insure_rel tar on tai.id = tar.accident_insure_id " +
        " left join user_info u on tai.insure_user_id = u.uid where tai.id is not null ";
    var paramsArray=[],i=0;
    if(params.accidentInsureId){
        paramsArray[i++] = params.accidentInsureId;
        query = query + " and tai.id = ? ";
    }
    if(params.accidentId){
        paramsArray[i++] = params.accidentId;
        query = query + " and tar.accident_id = ? ";
    }
    if(params.insureType){
        paramsArray[i++] = params.insureType;
        query = query + " and tai.insure_type = ? ";
    }
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and tai.insure_id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and tai.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and tai.created_on <= ? ";
    }
    if(params.financialLoanStatus){
        paramsArray[i++] = params.financialLoanStatus;
        query = query + " and tai.financial_loan_status = ? ";
    }
    if(params.insurePlanStart){
        paramsArray[i++] = params.insurePlanStart;
        query = query + " and tai.insure_plan >= ? ";
    }
    if(params.insurePlanEnd){
        paramsArray[i++] = params.insurePlanEnd;
        query = query + " and tai.insure_plan <= ? ";
    }
    if(params.insureStatus){
        paramsArray[i++] = params.insureStatus;
        query = query + " and tai.insure_status = ? ";
    }
    if(params.completedDateStart){
        paramsArray[i++] = params.completedDateStart +" 00:00:00";
        query = query + " and tai.completed_date >= ? ";
    }
    if(params.completedDateEnd){
        paramsArray[i++] = params.completedDateEnd +" 23:59:59";
        query = query + " and tai.completed_date <= ? ";
    }
    query = query + " order by tai.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentInsure ');
        return callback(error,rows);
    });
}

function updateTruckAccidentInsure(params,callback){
    var query = " update truck_accident_insure set insure_id = ? , insure_type = ? , insure_plan = ? , payment_explain = ? , " +
        " financial_loan = ? , insure_actual = ? , check_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.paymentExplain;
    paramsArray[i++]=params.financialLoan;
    paramsArray[i++]=params.insureActual;
    paramsArray[i++]=params.checkExplain;
    paramsArray[i]=params.accidentInsureId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentInsure ');
        return callback(error,rows);
    });
}

function updateTruckAccidentInsureStatus(params,callback){
    var query = " update truck_accident_insure set insure_status = ? , completed_date = ? , date_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureStatus;
    paramsArray[i++]=params.completedDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.accidentInsureId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentInsureStatus ');
        return callback(error,rows);
    });
}

function getTruckAccidentInsurePlanTotal(params,callback) {
    var query = " select count(ta.id) as insure_plan_count,sum(ta.insure_plan) as insure_plan from truck_accident_insure ta where ta.id is not null ";
    var paramsArray=[],i=0;
    if(params.insureStatus){
        paramsArray[i++] = params.insureStatus;
        query = query + " and ta.insure_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentInsurePlanTotal ');
        return callback(error,rows);
    });
}

function getTruckAccidentInsureMonthStat(params,callback){
    var query = " select db.y_month,tit.id,count(case when tai.insure_status = "+params.insureStatus+" then tai.id end) as accident_insure_count, " +
        " sum(case when tai.insure_status = "+params.insureStatus+" then tai.insure_actual end) as accident_insure_actual from date_base db " +
        " inner join truck_insure_type tit " +
        " left join truck_accident_insure tai on db.id = tai.date_id and tit.id = tai.insure_type where db.id is not null ";
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month,tit.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentInsureMonthStat ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckAccidentInsure : addTruckAccidentInsure,
    getTruckAccidentInsure : getTruckAccidentInsure,
    updateTruckAccidentInsure : updateTruckAccidentInsure,
    updateTruckAccidentInsureStatus : updateTruckAccidentInsureStatus,
    getTruckAccidentInsurePlanTotal : getTruckAccidentInsurePlanTotal,
    getTruckAccidentInsureMonthStat : getTruckAccidentInsureMonthStat
}

