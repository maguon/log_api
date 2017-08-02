/**
 * Created by zwl on 2017/7/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckInsureRelDAO.js');

function addTruckInsureRel(params,callback){
    var query = " insert into truck_insure_rel (truck_id,insure_id,insure_type,insure_num,insure_money," +
        " insure_date,start_date,end_date,date_id)  values ( ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insureNum;
    paramsArray[i++]=params.insureMoney;
    paramsArray[i++]=params.insureDate;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckInsureRel ');
        return callback(error,rows);
    });
}

function getTruckInsureRel(params,callback) {
    var query = " select r.*,i.insure_name from truck_insure_rel r left join truck_insure i on r.insure_id = i.id where r.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and r.id = ? ";
    }
    if(params.insureNum){
        paramsArray[i++] = params.insureNum;
        query = query + " and r.insure_num = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and r.truck_id = ? ";
    }
    if(params.active){
        paramsArray[i++] = params.active;
        query = query + " and r.active = ? ";
    }
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
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsureCountTotal ');
        return callback(error,rows);
    });
}

function updateTruckInsureRel(params,callback){
    var query = " update truck_insure_rel set truck_id = ? , insure_id = ? , insure_type = ? , insure_num = ? , insure_money = ? ," +
        " start_date = ? , end_date = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insureNum;
    paramsArray[i++]=params.insureMoney;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckInsureRel ');
        return callback(error,rows);
    });
}



module.exports ={
    addTruckInsureRel : addTruckInsureRel,
    getTruckInsureRel: getTruckInsureRel,
    getTruckInsureTypeTotal : getTruckInsureTypeTotal,
    getTruckInsureMoneyTotal : getTruckInsureMoneyTotal,
    getTruckInsureCountTotal : getTruckInsureCountTotal,
    updateTruckInsureRel : updateTruckInsureRel
}