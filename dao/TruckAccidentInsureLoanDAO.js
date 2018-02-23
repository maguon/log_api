/**
 * Created by zwl on 2018/2/23.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentInsureLoanDAO.js');

function addTruckAccidentInsureLoan(params,callback){
    var query = " insert into truck_accident_insure_loan ( accident_insure_id ) values ( ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.accidentInsureId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckAccidentInsureLoan ');
        return callback(error,rows);
    });
}

function getTruckAccidentInsureLoan(params,callback) {
    var query = " select tail.*,tai.insure_type,ti.insure_name,tai.insure_plan," +
        " u.real_name as insure_user_name,tai.payment_explain,tai.created_on as accident_insure_date, " +
        " u1.real_name as loan_user_name,u2.real_name as repayment_user_name from truck_accident_insure_loan tail " +
        " left join truck_accident_insure tai on tail.accident_insure_id = tai.id " +
        " left join truck_insure ti on tai.insure_id = ti.id " +
        " left join user_info u on tai.insure_user_id = u.uid " +
        " left join user_info u1 on tail.loan_user_id = u1.uid " +
        " left join user_info u2 on tail.repayment_user_id = u2.uid where tail.id is not null ";
    var paramsArray=[],i=0;
    if(params.accidentInsureId){
        paramsArray[i++] = params.accidentInsureId;
        query = query + " and tai.id = ? ";
    }
    if(params.insureType){
        paramsArray[i++] = params.insureType;
        query = query + " and tai.insure_type = ? ";
    }
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and ti.id = ? ";
    }
    if(params.loanDateStart){
        paramsArray[i++] = params.loanDateStart +" 00:00:00";
        query = query + " and tail.loan_date >= ? ";
    }
    if(params.loanDateEnd){
        paramsArray[i++] = params.loanDateEnd +" 23:59:59";
        query = query + " and tail.loan_date <= ? ";
    }
    if(params.loanStatus){
        paramsArray[i++] = params.loanStatus;
        query = query + " and tail.loan_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccidentInsureLoan ');
        return callback(error,rows);
    });
}

function updateTruckAccidentInsureLoan(params,callback){
    var query = " update truck_accident_insure_loan set loan_user_id = ? , loan_money = ? , loan_explain = ? , loan_date = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.loanMoney;
    paramsArray[i++]=params.loanExplain;
    paramsArray[i++]=params.loanDate;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentInsureLoan ');
        return callback(error,rows);
    });
}

function updateTruckAccidentInsureRepayment(params,callback){
    var query = " update truck_accident_insure_loan set repayment_user_id = ? , repayment_money = ? , repayment_explain = ? , repayment_date = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.repaymentMoney;
    paramsArray[i++]=params.repaymentExplain;
    paramsArray[i++]=params.repaymentDate;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentInsureRepayment ');
        return callback(error,rows);
    });
}

function updateTruckAccidentInsureLoanStatus(params,callback){
    var query = " update truck_accident_insure_loan set loan_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.loanStatus;
    paramsArray[i]=params.loanId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckAccidentInsureLoanStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckAccidentInsureLoan : addTruckAccidentInsureLoan,
    getTruckAccidentInsureLoan : getTruckAccidentInsureLoan,
    updateTruckAccidentInsureLoan : updateTruckAccidentInsureLoan,
    updateTruckAccidentInsureRepayment : updateTruckAccidentInsureRepayment,
    updateTruckAccidentInsureLoanStatus : updateTruckAccidentInsureLoanStatus
}
