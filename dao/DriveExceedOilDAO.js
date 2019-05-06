/**
 * Created by zwl on 2018/6/12.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDAO.js');

function addDriveExceedOil(params,callback){
    var query = " insert into drive_exceed_oil (drive_id,truck_id,oil_date,date_id,remark) values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.oilDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveExceedOil ');
        return callback(error,rows);
    });
}

function getDriveExceedOil(params,callback) {
    var query = " select deo.*,d.drive_name,t.truck_num,c.company_name " +
        " from drive_exceed_oil deo " +
        " left join drive_info d on deo.drive_id = d.id " +
        " left join truck_info t on deo.truck_id = t.id " +
        " left join company_info c on d.company_id = c.id " +
        " left join date_base db on deo.date_id = db.id " +
        " where deo.id is not null ";
    var paramsArray=[],i=0;
    if(params.exceedOilId){
        paramsArray[i++] = params.exceedOilId;
        query = query + " and deo.id = ? ";
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
        query = query + " and d.company_id = ? ";
    }
    if(params.oilDateStart){
        paramsArray[i++] = params.oilDateStart;
        query = query + " and deo.oil_date >= ? ";
    }
    if(params.oilDateEnd){
        paramsArray[i++] = params.oilDateEnd;
        query = query + " and deo.oil_date <= ? ";
    }
    if(params.oilStatus){
        paramsArray[i++] = params.oilStatus;
        query = query + " and deo.oil_status = ? ";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOil ');
        return callback(error,rows);
    });
}

function getDriveExceedOilCount(params,callback) {
    var query = " select settle_status,count(deo.id)as exceed_oil_count,sum(deo.actual_money)as actual_money " +
        " from drive_exceed_oil deo " +
        " where deo.id is not null ";
    var paramsArray=[],i=0;
    query = query + ' group by deo.settle_status ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilCount ');
        return callback(error,rows);
    });
}

function updateDriveExceedOil(params,callback){
    var query = " update drive_exceed_oil set plan_oil = ? , plan_urea = ? , actual_oil = ? , actual_urea = ? , " +
        " exceed_oil = ? , exceed_urea = ? , actual_money = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.planOil;
    paramsArray[i++]=params.planUrea;
    paramsArray[i++]=params.actualOil;
    paramsArray[i++]=params.actualUrea;
    paramsArray[i++]=params.exceedOil;
    paramsArray[i++]=params.exceedUrea;
    paramsArray[i++]=params.actualMoney;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOil ');
        return callback(error,rows);
    });
}

function updateActualOilPlus(params,callback){
    var query = " update drive_exceed_oil set actual_oil = actual_oil + ? , actual_urea = actual_urea + ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.actualOil;
    paramsArray[i++]=params.actualUrea;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateActualOilPlus ');
        return callback(error,rows);
    });
}

function updateActualOilMinus(params,callback){
    var query = " update drive_exceed_oil set actual_oil = actual_oil - ? , actual_urea = actual_urea - ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.actualOil;
    paramsArray[i++]=params.actualUrea;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateActualOilMinus ');
        return callback(error,rows);
    });
}

function updateDriveExceedOilStatus(params,callback){
    var query = " update drive_exceed_oil set settle_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.settleStatus;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOilStatus ');
        return callback(error,rows);
    });
}

function updateDriveOilStatus(params,callback){
    var query = " update drive_exceed_oil set oil_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.oilStatus;
    paramsArray[i]=params.exceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveOilStatus ');
        return callback(error,rows);
    });
}

function getDriveOilMonthStat(params,callback) {
    var query = " select db.y_month,sum(case when deo.settle_status = "+params.settleStatus+" then deo.actual_oil end) as actual_oil " +
        " from date_base db " +
        " left join drive_exceed_oil deo on db.id = deo.date_id " +
        " where db.id is not null " ;
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + ' and db.y_month >= ? '
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + ' and db.y_month <= ? '
    }
    query = query + " group by db.y_month " ;
    query = query + " order by db.y_month desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveOilMonthStat ');
        return callback(error,rows);
    });
}

function getDriveUreaMonthStat(params,callback) {
    var query = " select db.y_month,sum(case when deo.settle_status = "+params.settleStatus+" then deo.actual_urea end) as actual_urea " +
        " from date_base db " +
        " left join drive_exceed_oil deo on db.id = deo.date_id " +
        " where db.id is not null " ;
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + ' and db.y_month >= ? '
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + ' and db.y_month <= ? '
    }
    query = query + " group by db.y_month " ;
    query = query + " order by db.y_month desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveUreaMonthStat ');
        return callback(error,rows);
    });
}

function getDriveOilMoneyMonthStat(params,callback) {
    var query = " select db.y_month,sum(case when deo.settle_status = "+params.settleStatus+" then deo.actual_money end) as actual_money " +
        " from date_base db " +
        " left join drive_exceed_oil deo on db.id = deo.date_id " +
        " where db.id is not null " ;
    var paramsArray=[],i=0;
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + ' and db.y_month >= ? '
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + ' and db.y_month <= ? '
    }
    query = query + " group by db.y_month " ;
    query = query + " order by db.y_month desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveOilMoneyMonthStat ');
        return callback(error,rows);
    });
}

function getDriveOilWeekStat(params,callback) {
    var query = " select db.y_week,sum(case when deo.settle_status = "+params.settleStatus+" then deo.actual_oil end) as actual_oil " +
        " from date_base db " +
        " left join drive_exceed_oil deo on db.id = deo.date_id " +
        " where db.id is not null " ;
    var paramsArray=[],i=0;
    if(params.weekStart){
        paramsArray[i++] = params.weekStart;
        query = query + ' and db.y_week >= ? '
    }
    if(params.weekEnd){
        paramsArray[i++] = params.weekEnd;
        query = query + ' and db.y_week <= ? '
    }
    query = query + " group by db.y_week " ;
    query = query + " order by db.y_week desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveOilWeekStat ');
        return callback(error,rows);
    });
}

function getDriveUreaWeekStat(params,callback) {
    var query = " select db.y_week,sum(case when deo.settle_status = "+params.settleStatus+" then deo.actual_urea end) as actual_urea " +
        " from date_base db " +
        " left join drive_exceed_oil deo on db.id = deo.date_id " +
        " where db.id is not null " ;
    var paramsArray=[],i=0;
    if(params.weekStart){
        paramsArray[i++] = params.weekStart;
        query = query + ' and db.y_week >= ? '
    }
    if(params.weekEnd){
        paramsArray[i++] = params.weekEnd;
        query = query + ' and db.y_week <= ? '
    }
    query = query + " group by db.y_week " ;
    query = query + " order by db.y_week desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveUreaWeekStat ');
        return callback(error,rows);
    });
}

function getDriveOilMoneyWeekStat(params,callback) {
    var query = " select db.y_week,sum(case when deo.settle_status = "+params.settleStatus+" then deo.actual_money end) as actual_money " +
        " from date_base db " +
        " left join drive_exceed_oil deo on db.id = deo.date_id " +
        " where db.id is not null " ;
    var paramsArray=[],i=0;
    if(params.weekStart){
        paramsArray[i++] = params.weekStart;
        query = query + ' and db.y_week >= ? '
    }
    if(params.weekEnd){
        paramsArray[i++] = params.weekEnd;
        query = query + ' and db.y_week <= ? '
    }
    query = query + " group by db.y_week " ;
    query = query + " order by db.y_week desc " ;
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveOilMoneyWeekStat ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveExceedOil : addDriveExceedOil,
    getDriveExceedOil : getDriveExceedOil,
    getDriveExceedOilCount : getDriveExceedOilCount,
    updateDriveExceedOil : updateDriveExceedOil,
    updateActualOilPlus : updateActualOilPlus,
    updateActualOilMinus : updateActualOilMinus,
    updateDriveExceedOilStatus : updateDriveExceedOilStatus,
    updateDriveOilStatus : updateDriveOilStatus,
    getDriveOilMonthStat : getDriveOilMonthStat,
    getDriveUreaMonthStat : getDriveUreaMonthStat,
    getDriveOilMoneyMonthStat : getDriveOilMoneyMonthStat,
    getDriveOilWeekStat : getDriveOilWeekStat,
    getDriveUreaWeekStat : getDriveUreaWeekStat,
    getDriveOilMoneyWeekStat : getDriveOilMoneyWeekStat
}
