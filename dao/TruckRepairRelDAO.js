/**
 * Created by zwl on 2017/7/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckRepairRelDAO.js');

function addTruckRepairRel(params,callback){
    var query = " insert into truck_repair_rel (number,truck_id,drive_id,drive_name,repair_type," +
        " accident_id,repair_date,date_id,repair_reason,payment_type,payment_status) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.repairType;
    paramsArray[i++]=params.accidentId;
    paramsArray[i++]=params.repairDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.repairReason;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.paymentStatus;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckRepairRel ');
        return callback(error,rows);
    });
}

function addUploadTruckRepairRel(params,callback){
    var query = " insert into truck_repair_rel (number,truck_id,drive_id,drive_name,repair_money,parts_money,maintain_money," +
        " repair_date,repair_type,end_date,repair_status,date_id,repair_reason,remark,payment_type,payment_status) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.repairMoney;
    paramsArray[i++]=params.partsMoney;
    paramsArray[i++]=params.maintainMoney;
    paramsArray[i++]=params.repairDate;
    paramsArray[i++]=params.repairType;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.repairStatus;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.repairReason;
    paramsArray[i++]=params.remark;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.paymentStatus;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUploadTruckRepairRel ');
        return callback(error,rows);
    });
}

function getTruckRepairRel(params,callback) {
    var query = " select trr.*,ti.truck_num,ti.truck_type,ri.repair_station_name,ta.address as accident_address,c.company_name " +
        " from truck_repair_rel trr" +
        " left join truck_info ti on trr.truck_id = ti.id " +
        " left join repair_station_info ri on trr.repair_station_id = ri.id " +
        " left join truck_accident_info ta on ta.id = trr.accident_id " +
        " left join company_info c on ti.company_id = c.id " +
        " where trr.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and trr.id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and trr.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and ti.truck_num = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and ti.truck_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and ti.company_id = ? ";
    }
    if(params.repairStatus){
        paramsArray[i++] = params.repairStatus;
        query = query + " and trr.repair_status = ? ";
    }
    if(params.repairType){
        paramsArray[i++] = params.repairType;
        query = query + " and trr.repair_type = ? ";
    }
    if(params.repairDateStart){
        paramsArray[i++] = params.repairDateStart +" 00:00:00";
        query = query + " and trr.repair_date >= ? ";
    }
    if(params.repairDateEnd){
        paramsArray[i++] = params.repairDateEnd +" 23:59:59";
        query = query + " and trr.repair_date <= ? ";
    }
    if(params.endDateStart){
        paramsArray[i++] = params.endDateStart +" 00:00:00";
        query = query + " and trr.end_date >= ? ";
    }
    if(params.endDateEnd){
        paramsArray[i++] = params.endDateEnd +" 23:59:59";
        query = query + " and trr.end_date <= ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and trr.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and trr.created_on <= ? ";
    }
    if(params.accidentId){
        paramsArray[i++] = params.accidentId;
        query = query + " and trr.accident_id = ? ";
    }
    if(params.paymentType){
        paramsArray[i++] = params.paymentType;
        query = query + " and trr.payment_type = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and trr.payment_status = ? ";
    }
    query = query + ' order by trr.id desc ';
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
    var query = " select count(trr.id) as repair_count,sum(trr.repair_money) as repair_money," +
        " sum(trr.parts_money) as parts_money, sum(trr.maintain_money) as maintain_money " +
        " from truck_repair_rel trr" +
        " left join truck_info ti on trr.truck_id = ti.id " +
        " left join repair_station_info ri on trr.repair_station_id = ri.id " +
        " left join truck_accident_info ta on ta.id = trr.accident_id " +
        " left join company_info c on ti.company_id = c.id " +
        " where trr.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and trr.id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and trr.truck_id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and ti.truck_num = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and ti.truck_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and ti.company_id = ? ";
    }
    if(params.repairStatus){
        paramsArray[i++] = params.repairStatus;
        query = query + " and trr.repair_status = ? ";
    }
    if(params.repairType){
        paramsArray[i++] = params.repairType;
        query = query + " and trr.repair_type = ? ";
    }
    if(params.repairDateStart){
        paramsArray[i++] = params.repairDateStart +" 00:00:00";
        query = query + " and trr.repair_date >= ? ";
    }
    if(params.repairDateEnd){
        paramsArray[i++] = params.repairDateEnd +" 23:59:59";
        query = query + " and trr.repair_date <= ? ";
    }
    if(params.endDateStart){
        paramsArray[i++] = params.endDateStart +" 00:00:00";
        query = query + " and trr.end_date >= ? ";
    }
    if(params.endDateEnd){
        paramsArray[i++] = params.endDateEnd +" 23:59:59";
        query = query + " and trr.end_date <= ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and trr.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and trr.created_on <= ? ";
    }
    if(params.accidentId){
        paramsArray[i++] = params.accidentId;
        query = query + " and trr.accident_id = ? ";
    }
    if(params.paymentType){
        paramsArray[i++] = params.paymentType;
        query = query + " and trr.payment_type = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and trr.payment_status = ? ";
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
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
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
    query = query + ' order by db.y_month desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckRepairMoneyTotal ');
        return callback(error,rows);
    });
}

function updateTruckRepairRel(params,callback){
    var query = " update truck_repair_rel set repair_station_id = ? , repair_user = ? , repair_money = ? , " +
        " parts_money = ? , maintain_money = ? , end_date = ? , repair_status = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repairStationId;
    paramsArray[i++]=params.repairUser;
    paramsArray[i++]=params.repairMoney;
    paramsArray[i++]=params.partsMoney;
    paramsArray[i++]=params.maintainMoney;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.repairStatus;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckRepairRel ');
        return callback(error,rows);
    });
}

function updateTruckRepairRelBase(params,callback){
    var query = " update truck_repair_rel set repair_type = ? , accident_id = ? , repair_reason = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.repairType;
    paramsArray[i++]=params.accidentId;
    paramsArray[i++]=params.repairReason;
    paramsArray[i]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckRepairRelBase ');
        return callback(error,rows);
    });
}

function updatePaymentStatus(params,callback){
    var query = " update truck_repair_rel set payment_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.paymentStatus;
    paramsArray[i]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updatePaymentStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckRepairRel : addTruckRepairRel,
    addUploadTruckRepairRel : addUploadTruckRepairRel,
    getTruckRepairRel: getTruckRepairRel,
    getTruckRepairRelCount : getTruckRepairRelCount,
    getTruckRepairCountTotal : getTruckRepairCountTotal,
    getTruckRepairMoneyTotal : getTruckRepairMoneyTotal,
    updateTruckRepairRel : updateTruckRepairRel,
    updateTruckRepairRelBase : updateTruckRepairRelBase,
    updatePaymentStatus : updatePaymentStatus
}