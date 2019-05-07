/**
 * Created by zwl on 2019/5/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDateDAO.js');

function addDriveExceedOilDate(params,callback){
    var query = " insert into drive_exceed_oil_date (month_date_id,drive_id,truck_id,plan_oil_total,plan_urea_total, " +
        " actual_oil_total,actual_urea_total,actual_money,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.monthDateId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.planOilTotal;
    paramsArray[i++]=params.planUreaTotal;
    paramsArray[i++]=params.actualOilTotal;
    paramsArray[i++]=params.actualUreaTotal;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveExceedOilDate ');
        return callback(error,rows);
    });
}

function getDriveExceedOilDate(params,callback) {
    var query = " select deod.*,d.drive_name,t.truck_num,c.company_name " +
        " from drive_exceed_oil_date deod " +
        " left join drive_info d on deod.drive_id = d.id " +
        " left join truck_info t on deod.truck_id = t.id " +
        " left join company_info c on d.company_id = c.id " +
        " where deod.id is not null ";
    var paramsArray=[],i=0;
    if(params.exceedOilDateId){
        paramsArray[i++] = params.exceedOilDateId;
        query = query + " and deod.id = ? ";
    }
    if(params.monthDateId){
        paramsArray[i++] = params.monthDateId;
        query = query + " and deod.month_date_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and deod.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and deod.truck_id = ? ";
    }
    if(params.settleStatus){
        paramsArray[i++] = params.settleStatus;
        query = query + " and deod.settle_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilDate ');
        return callback(error,rows);
    });
}

function getDriveExceedOilMonth(params,callback) {
    var query = " select deod.id,deo.drive_id,d.drive_name,deo.truck_id,t.truck_num,c.company_name,db.y_month, " +
        " sum(deo.plan_oil) as plan_oil,sum(deo.plan_urea) as plan_urea, " +
        " sum(deo.actual_oil) as actual_oil,sum(deo.actual_urea) as actual_urea,sum(deo.actual_money)as actual_money," +
        " deod.settle_status " +
        " from drive_exceed_oil deo " +
        " left join date_base db on deo.date_id = db.id " +
        " left join drive_exceed_oil_date deod on deod.drive_id=deo.drive_id and deod.truck_id = deo.truck_id and deod.month_date_id =db.y_month " +
        " left join drive_info d on deo.drive_id = d.id " +
        " left join truck_info t on deo.truck_id = t.id " +
        " left join company_info c on d.company_id = c.id " +
        " where deo.id is not null ";
    var paramsArray=[],i=0;
    if(params.exceedOilDateId){
        paramsArray[i++] = params.exceedOilDateId;
        query = query + " and deod.id = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and deo.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and deo.truck_id = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id = ? ";
    }
    query = query + ' group by deo.drive_id,deo.truck_id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilMonth ');
        return callback(error,rows);
    });
}

function updateDriveExceedOilDate(params,callback){
    var query = " update drive_exceed_oil_date set plan_oil_total = ? , plan_urea_total = ? , " +
        " actual_oil_total = ? , actual_urea_total = ? , actual_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.planOilTotal;
    paramsArray[i++]=params.planUreaTotal;
    paramsArray[i++]=params.actualOilTotal;
    paramsArray[i++]=params.actualUreaTotal;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOilDate ');
        return callback(error,rows);
    });
}

function updateExceedOilDateStatus(params,callback){
    var query = " update drive_exceed_oil_date set settle_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.settleStatus;
    paramsArray[i]=params.exceedOilDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateExceedOilDateStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveExceedOilDate : addDriveExceedOilDate,
    getDriveExceedOilDate : getDriveExceedOilDate,
    getDriveExceedOilMonth : getDriveExceedOilMonth,
    updateDriveExceedOilDate : updateDriveExceedOilDate,
    updateExceedOilDateStatus : updateExceedOilDateStatus
}
