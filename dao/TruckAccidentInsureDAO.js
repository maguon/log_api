/**
 * Created by zwl on 2018/2/7.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentInsureDAO.js');

function addTruckAccidentInsure(params,callback){
    var query = " insert into truck_accident_insure ( insure_id , insure_type , insure_plan , " +
        " financial_loan_status , financial_loan , insure_actual , payment_explain ) values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insurePlan;
    paramsArray[i++]=params.financialLoanStatus;
    paramsArray[i++]=params.financialLoan;
    paramsArray[i++]=params.insureActual;
    paramsArray[i]=params.paymentExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckAccidentInsure ');
        return callback(error,rows);
    });
}

function getTruckAccidentInsure(params,callback) {
    var query = " select tai.*,ti.insure_name from truck_accident_insure tai " +
        " left join truck_insure ti on tai.insure_id = ti.id where tai.id is not null ";
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


module.exports ={
    addTruckAccidentInsure : addTruckAccidentInsure,
    getTruckAccidentInsure : getTruckAccidentInsure
}

