/**
 * Created by zwl on 2017/7/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckInsureRelDAO.js');

function addTruckInsureRel(params,callback){
    var query = " insert into truck_insure_rel (truck_id,insure_id,insure_type,insure_num,insure_money,tax_money,total_money," +
        " insure_date,start_date,end_date,date_id,insure_explain,insure_user_id) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insureNum;
    paramsArray[i++]=params.insureMoney;
    paramsArray[i++]=params.taxMoney;
    paramsArray[i++]=params.totalMoney;
    paramsArray[i++]=params.insureDate;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.insureExplain;
    paramsArray[i]=params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckInsureRel ');
        return callback(error,rows);
    });
}

function getTruckInsureRel(params,callback) {
    var query = " select r.*,i.insure_name,t.truck_num,t.truck_type,u.real_name as insure_user_name," +
        " u1.real_name as delete_user_name,c.company_name " +
        " from truck_insure_rel r " +
        " left join truck_insure i on r.insure_id = i.id " +
        " left join truck_info t on r.truck_id = t.id " +
        " left join user_info u on r.insure_user_id = u.uid " +
        " left join user_info u1 on r.delete_user_id = u1.uid " +
        " left join company_info c on t.company_id = c.id " +
        " where r.insure_status >=0 and r.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and r.id = ? ";
    }
    if(params.insureNum){
        paramsArray[i++] = params.insureNum;
        query = query + " and r.insure_num = ? ";
    }
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and r.insure_id = ? ";
    }
    if(params.insureType){
        paramsArray[i++] = params.insureType;
        query = query + " and r.insure_type = ? ";
    }
    if(params.insureUserId){
        paramsArray[i++] = params.insureUserId;
        query = query + " and r.insure_user_id = ? ";
    }
    if(params.insureUserName){
        paramsArray[i++] = params.insureUserName;
        query = query + " and u.real_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and r.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and t.truck_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and t.company_id = ? ";
    }
    if(params.endDateStart){
        paramsArray[i++] = params.endDateStart;
        query = query + " and r.end_date >= ? ";
    }
    if(params.endDateEnd){
        paramsArray[i++] = params.endDateEnd;
        query = query + " and r.end_date <= ? ";
    }
    if(params.active){
        paramsArray[i++] = params.active;
        query = query + " and r.active = ? ";
    }
    query = query + " group by r.id ";
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsureRel ');
        return callback(error,rows);
    });
}

function getTruckInsureTypeTotal(params,callback) {
    var query = " select sum(ir.insure_money) as insure_money,i.insure_name,ir.insure_type from truck_insure_rel ir " +
        " left join truck_insure i on ir.insure_id = i.id " +
        " left join date_base db on ir.date_id = db.id " +
        " where ir.id is not null ";
    var paramsArray=[],i=0;
    if(params.year){
        paramsArray[i++] = params.year;
        query = query + " and db.year = ? ";
    }
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and ir.insure_id = ? ";
    }
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by i.insure_name,ir.insure_type ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsureTypeTotal ');
        return callback(error,rows);
    });
}

function getTruckInsureMoneyTotal(params,callback) {
    if(params.insureId==null || params.insureId==""){
        var query = " select db.y_month,tit.id ,sum(tir.insure_money) as insure_money " +
            " from date_base db inner join truck_insure_type tit " +
            " left join truck_insure_rel tir on db.id = tir.date_id and tit.id = tir.insure_type where db.id is not null ";
    }else{
        var query = " select db.y_month,tit.id ,sum(case when tir.insure_id = "+params.insureId+" then tir.insure_money end) as insure_money " +
            " from date_base db inner join truck_insure_type tit " +
            " left join truck_insure_rel tir on db.id = tir.date_id and tit.id = tir.insure_type where db.id is not null ";
    }
    var paramsArray=[],i=0;
    if(params.year){
        paramsArray[i++] = params.year;
        query = query + " and db.year = ? ";
    }
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month,tit.id ';
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsureMoneyTotal ');
        return callback(error,rows);
    });
}

function getTruckInsureCountTotal(params,callback) {
    if(params.insureId==null || params.insureId==""){
        var query = " select db.y_month,count(tir.id) as insure_count " +
            " from date_base db left join truck_insure_rel tir on db.id = tir.date_id " +
            " left join truck_insure ti on tir.insure_id = ti.id where db.id is not null ";
    }else{
        var query = " select db.y_month,count(case when tir.insure_id = "+params.insureId+" then tir.id end) as insure_count " +
            " from date_base db left join truck_insure_rel tir on db.id = tir.date_id " +
            " left join truck_insure ti on tir.insure_id = ti.id where db.id is not null ";
    }
    var paramsArray=[],i=0;
    if(params.year){
        paramsArray[i++] = params.year;
        query = query + " and db.year = ? ";
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
        logger.debug(' getTruckInsureCountTotal ');
        return callback(error,rows);
    });
}

function updateTruckInsureRel(params,callback){
    var query = " update truck_insure_rel set truck_id = ? , insure_id = ? , insure_type = ? , insure_num = ? , insure_money = ? ," +
        " tax_money = ? , total_money = ? , start_date = ? , end_date = ? , insure_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insureNum;
    paramsArray[i++]=params.insureMoney;
    paramsArray[i++]=params.taxMoney;
    paramsArray[i++]=params.totalMoney;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.insureExplain;
    paramsArray[i]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckInsureRel ');
        return callback(error,rows);
    });
}

function updateTruckInsureStatus(params,callback){
    var query = " update truck_insure_rel set insure_status = ? , delete_user_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.insureStatus;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckInsureStatus ');
        return callback(error,rows);
    });
}

function updateTruckInsureRelActive(params,callback){
    var query = " update truck_insure_rel set active = 0 where truck_id = ? and insure_type = ? and id != ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.truckId;
    paramsArray[i++] = params.insureType;
    paramsArray[i] = params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckInsureRelActive ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckInsureRel : addTruckInsureRel,
    getTruckInsureRel: getTruckInsureRel,
    getTruckInsureTypeTotal : getTruckInsureTypeTotal,
    getTruckInsureMoneyTotal : getTruckInsureMoneyTotal,
    getTruckInsureCountTotal : getTruckInsureCountTotal,
    updateTruckInsureRel : updateTruckInsureRel,
    updateTruckInsureStatus : updateTruckInsureStatus,
    updateTruckInsureRelActive : updateTruckInsureRelActive
}