/**
 * Created by zwl on 2018/3/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureLoanDAO.js');

function addDamageInsureLoan(params,callback){
    var query = " insert into damage_insure_loan ( damage_insure_id ) values ( ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.damageInsureId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDamageInsureLoan ');
        return callback(error,rows);
    });
}

function getDamageInsureLoan(params,callback) {
    var query = " select dil.*,di.insure_id,ti.insure_name,di.insure_plan,di.financial_loan," +
        " u.real_name as insure_user_name,di.payment_explain,di.created_on as accident_insure_date, " +
        " u1.real_name as loan_user_name,u2.real_name as repayment_user_name from damage_insure_loan dil " +
        " left join damage_insure di on dil.damage_insure_id = di.id " +
        " left join truck_insure ti on di.insure_id = ti.id " +
        " left join user_info u on di.insure_user_id = u.uid " +
        " left join user_info u1 on dil.loan_user_id = u1.uid " +
        " left join user_info u2 on dil.repayment_user_id = u2.uid where dil.id is not null ";
    var paramsArray=[],i=0;
    if(params.damageInsureLoanId){
        paramsArray[i++] = params.damageInsureLoanId;
        query = query + " and dil.id = ? ";
    }
    if(params.damageInsureId){
        paramsArray[i++] = params.damageInsureId;
        query = query + " and di.id = ? ";
    }
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and ti.id = ? ";
    }
    if(params.insureUserId){
        paramsArray[i++] = params.insureUserId;
        query = query + " and di.insure_user_id = ? ";
    }
    if(params.insureUserName){
        paramsArray[i++] = params.insureUserName;
        query = query + " and u.real_name = ? ";
    }
    if(params.loanMoneyStart){
        paramsArray[i++] = params.loanMoneyStart;
        query = query + " and dil.loan_money >= ? ";
    }
    if(params.loanMoneyEnd){
        paramsArray[i++] = params.loanMoneyEnd;
        query = query + " and dil.loan_money <= ? ";
    }
    if(params.loanDateStart){
        paramsArray[i++] = params.loanDateStart +" 00:00:00";
        query = query + " and dil.loan_date >= ? ";
    }
    if(params.loanDateEnd){
        paramsArray[i++] = params.loanDateEnd +" 23:59:59";
        query = query + " and dil.loan_date <= ? ";
    }
    if(params.loanStatus){
        paramsArray[i++] = params.loanStatus;
        query = query + " and dil.loan_status = ? ";
    }
    query = query + " order by dil.id desc";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageInsureLoan ');
        return callback(error,rows);
    });
}

function updateDamageInsureLoan(params,callback){
    var query = " update damage_insure_loan set loan_user_id = ? , loan_money = ? , loan_explain = ? , loan_date = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.loanMoney;
    paramsArray[i++]=params.loanExplain;
    paramsArray[i++]=params.loanDate;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageInsureLoan ');
        return callback(error,rows);
    });
}

function updateDamageInsureRepayment(params,callback){
    var query = " update damage_insure_loan set repayment_user_id = ? , repayment_money = ? , repayment_explain = ? , repayment_date = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.repaymentMoney;
    paramsArray[i++]=params.repaymentExplain;
    paramsArray[i++]=params.repaymentDate;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageInsureRepayment ');
        return callback(error,rows);
    });
}

function updateDamageInsureLoanStatus(params,callback){
    var query = " update damage_insure_loan set loan_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanStatus;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDamageInsureLoanStatus ');
        return callback(error,rows);
    });
}

function getDamageInsureLoanStatusCount(params,callback) {
    var query = " select dil.loan_status,count(dil.id) as loan_status_count from damage_insure_loan dil where dil.id is not null ";
    var paramsArray=[],i=0;
    if(params.loanStatus){
        paramsArray[i++] = params.loanStatus;
        query = query + " and dil.loan_status = ? ";
    }
    query = query + " group by dil.loan_status";
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDamageInsureLoanStatusCount ');
        return callback(error,rows);
    });
}


module.exports ={
    addDamageInsureLoan : addDamageInsureLoan,
    getDamageInsureLoan : getDamageInsureLoan,
    updateDamageInsureLoan : updateDamageInsureLoan,
    updateDamageInsureRepayment : updateDamageInsureRepayment,
    updateDamageInsureLoanStatus : updateDamageInsureLoanStatus,
    getDamageInsureLoanStatusCount : getDamageInsureLoanStatusCount
}
