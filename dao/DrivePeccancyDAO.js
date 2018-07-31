/**
 * Created by zwl on 2018/6/11.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DrivePeccancyDAO.js');

function addDrivePeccancy(params,callback){
    var query = " insert into drive_peccancy (drive_id,truck_id,fine_score,fine_money,start_date,end_date,op_user_id,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.fineScore;
    paramsArray[i++]=params.fineMoney;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.userId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDrivePeccancy ');
        return callback(error,rows);
    });
}

function getDrivePeccancy(params,callback) {
    var query = " select dp.*,d.drive_name,t.truck_num,u.real_name as op_user_name from drive_peccancy dp " +
        " left join drive_info d on dp.drive_id = d.id " +
        " left join truck_info t on dp.truck_id = t.id " +
        " left join user_info u on dp.op_user_id = u.uid" +
        " where dp.id is not null ";
    var paramsArray=[],i=0;
    if(params.peccancyId){
        paramsArray[i++] = params.peccancyId;
        query = query + " and dp.id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and dp.drive_id = ? ";
    }
    if(params.startDateStart){
        paramsArray[i++] = params.startDateStart;
        query = query + " and dp.start_date >= ? ";
    }
    if(params.endDateEnd){
        paramsArray[i++] = params.endDateEnd;
        query = query + " and dp.end_date <= ? ";
    }
    if(params.fineStatus){
        paramsArray[i++] = params.fineStatus;
        query = query + " and dp.fine_status = ? ";
    }
    if(params.statStatus){
        paramsArray[i++] = params.statStatus;
        query = query + " and dp.stat_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDrivePeccancy ');
        return callback(error,rows);
    });
}

function getDrivePeccancyCount(params,callback) {
    var query = " select stat_status,count(dp.id)as peccancy_count,sum(dp.fine_money)as fine_money from drive_peccancy dp " +
        " where dp.id is not null ";
    var paramsArray=[],i=0;
    query = query + ' group by dp.stat_status ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDrivePeccancyCount ');
        return callback(error,rows);
    });
}

function updateDrivePeccancy(params,callback){
    var query = " update drive_peccancy set drive_id = ? , truck_id = ? , fine_score = ? , fine_money = ? , start_date = ? , end_date = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.fineScore;
    paramsArray[i++]=params.fineMoney;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.peccancyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDrivePeccancy ');
        return callback(error,rows);
    });
}

function updateDrivePeccancyStatStatus(params,callback){
    var query = " update drive_peccancy set stat_status = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.statStatus;
    paramsArray[i]=params.peccancyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDrivePeccancyStatStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDrivePeccancy : addDrivePeccancy,
    getDrivePeccancy : getDrivePeccancy,
    getDrivePeccancyCount : getDrivePeccancyCount,
    updateDrivePeccancy : updateDrivePeccancy,
    updateDrivePeccancyStatStatus : updateDrivePeccancyStatStatus
}