/**
 * Created by zwl on 2017/7/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckRepairRelDAO.js');

function addTruckRepairRel(params,callback){
    var query = " insert into truck_repair_rel (truck_id,repair_date,date_id,repair_reason)  values ( ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.repairDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.repairReason;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckRepairRel ');
        return callback(error,rows);
    });
}

function getTruckRepairRel(params,callback) {
    var query = " select * from truck_repair_rel where id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and truck_id = ? ";
    }
    if(params.repairNum){
        paramsArray[i++] = params.repairNum;
        query = query + " and repair_num = ? ";
    }
    if(params.repairStatus){
        paramsArray[i++] = params.repairStatus;
        query = query + " and repair_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckRepairRel ');
        return callback(error,rows);
    });
}

function getTruckRepairRelCount(params,callback) {
    var query = " select count(id) repair_count from truck_repair_rel where id is not null ";
    var paramsArray=[],i=0;
    if(params.repairStatus){
        paramsArray[i++] = params.repairStatus;
        query = query + " and repair_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckRepairRelCount ');
        return callback(error,rows);
    });
}

function getTruckRepairCountTotal(params,callback) {
    if(params.truckType==null || params.truckType==""){
        var query = " select db.y_month,count( trr.id) as repair_count from date_base db " +
            " left join truck_repair_rel trr on db.id = trr.date_id " +
            " left join truck_info ti on trr.truck_id = ti.id where db.id is not null ";
    }else{
        var query = " select db.y_month,count(case when ti.truck_type = "+params.truckType+" then trr.id end) as repair_count from date_base db " +
            " left join truck_repair_rel trr on db.id = trr.date_id " +
            " left join truck_info ti on trr.truck_id = ti.id where db.id is not null ";
    }
    var paramsArray=[],i=0;
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
        logger.debug(' getTruckRepairCountTotal ');
        return callback(error,rows);
    });
}

function getTruckRepairMoneyTotal(params,callback) {
    if(params.truckType==null || params.truckType==""){
        var query = " select db.y_month,sum(trr.repair_money) as repair_money from date_base db " +
            " left join truck_repair_rel trr on db.id = trr.date_id " +
            " left join truck_info ti on trr.truck_id = ti.id where db.id is not null ";
    }else{
        var query = " select db.y_month,sum(case when ti.truck_type = "+params.truckType+" then trr.repair_money end) as repair_money from date_base db " +
            " left join truck_repair_rel trr on db.id = trr.date_id " +
            " left join truck_info ti on trr.truck_id = ti.id where db.id is not null ";
    }
    var paramsArray=[],i=0;
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
        logger.debug(' getTruckRepairMoneyTotal ');
        return callback(error,rows);
    });
}

function updateTruckRepairRel(params,callback){
    var query = " update truck_repair_rel set repair_money = ? , end_date = ? , repair_status = ?, remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repairMoney;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.repairStatus;
    paramsArray[i]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckRepairRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckRepairRel : addTruckRepairRel,
    getTruckRepairRel: getTruckRepairRel,
    getTruckRepairRelCount : getTruckRepairRelCount,
    getTruckRepairCountTotal : getTruckRepairCountTotal,
    getTruckRepairMoneyTotal : getTruckRepairMoneyTotal,
    updateTruckRepairRel : updateTruckRepairRel
}